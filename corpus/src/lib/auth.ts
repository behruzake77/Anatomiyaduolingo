"use client";

/**
 * Subabase Auth asosidagi autentifikatsiya.
 * Foydalanuvchi ma'lumotlari PostgreSQL database'da saqlanadi.
 */

import { supabase, type Profile } from './supabase'

// Foydalanuvchi sessiyasi
export interface AuthUser {
  id: string
  email: string
  username: string
}

let currentUser: AuthUser | null = null
const listeners: ((user: AuthUser | null) => void)[] = []

// -----------------------------------------------------------------------------
// Oddiy event emitter — komponentlarni yangilash uchun
// -----------------------------------------------------------------------------
export function onAuthChange(callback: (user: AuthUser | null) => void) {
  listeners.push(callback)
  return () => {
    const idx = listeners.indexOf(callback)
    if (idx > -1) listeners.splice(idx, 1)
  }
}

function notify(user: AuthUser | null) {
  currentUser = user
  listeners.forEach(cb => cb(user))
}

// -----------------------------------------------------------------------------
// Boshlang'ich yuklash — mavjud sessiyani tekshirish
// -----------------------------------------------------------------------------
export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    notify({
      id: session.user.id,
      email: session.user.email || '',
      username: profile?.username || session.user.email?.split('@')[0] || 'user'
    })
  } else {
    notify(null)
  }

  // Auth holatini kuzatish
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      notify({
        id: session.user.id,
        email: session.user.email || '',
        username: profile?.username || session.user.email?.split('@')[0] || 'user'
      })
    } else if (event === 'SIGNED_OUT') {
      notify(null)
    }
  })
}

// -----------------------------------------------------------------------------
// Hozirgi foydalanuvchi
// -----------------------------------------------------------------------------
export function getCurrentUser(): AuthUser | null {
  return currentUser
}

// -----------------------------------------------------------------------------
// Ro'yxatdan o'tish (email + parol)
// -----------------------------------------------------------------------------
export async function register(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Subabase Auth orqali ro'yxatdan o'tish
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      // 2. Profile yaratish (trigger avtomatik yaratadi, lekin username yangilash kerak)
      await supabase
        .from('profiles')
        .upsert({ 
          id: data.user.id, 
          username,
          xp: 0,
          level: 1,
          streak: 0,
          daily_goal: 20
        })
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Ro\'yxatdan o\'tishda xatolik' }
  }
}

// -----------------------------------------------------------------------------
// Kirish (email + parol)
// -----------------------------------------------------------------------------
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Kirishda xatolik' }
  }
}

// -----------------------------------------------------------------------------
// Google bilan kirish
// -----------------------------------------------------------------------------
export async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/api/auth/callback` 
          : undefined
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Google bilan kirishda xatolik' }
  }
}

// -----------------------------------------------------------------------------
// Chiqish
// -----------------------------------------------------------------------------
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
  notify(null)
}

// -----------------------------------------------------------------------------
// Hisobni o'chirish
// -----------------------------------------------------------------------------
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const user = getCurrentUser()
  if (!user) return { success: false, error: 'Foydalanuvchi topilmadi' }

  try {
    // 1. Database ma'lumotlarini o'chirish (RLS avtomatik)
    await supabase.from('progress').delete().eq('user_id', user.id)
    await supabase.from('achievements').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)

    // 2. Auth hisobini o'chirish
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    
    if (error) {
      return { success: false, error: error.message }
    }

    notify(null)
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Hisobni o\'chirishda xatolik' }
  }
}

// -----------------------------------------------------------------------------
// Parolni tiklash so'rovi
// -----------------------------------------------------------------------------
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' 
        ? `${window.location.origin}/reset-password` 
        : undefined
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Parol tiklashda xatolik' }
  }
}
