"use client";

/**
 * Supabase Auth — email + parol, email tasdiqlash (OTP kod) va OAuth.
 * Email tasdiqlash yoqilganda signUp sessiyasiz qaytadi: foydalanuvchi
 * pochtasidagi 6 xonali kodni kiritishi kerak (verifyOtp).
 */

import type { EmailOtpType, Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthResult {
  success: boolean;
  needsVerification?: boolean;
  error?: string;
}

let currentUser: AuthUser | null = null;
const listeners: ((user: AuthUser | null) => void)[] = [];
let authStarted = false;

export function onAuthChange(callback: (user: AuthUser | null) => void) {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notify(user: AuthUser | null) {
  currentUser = user;
  listeners.forEach((cb) => cb(user));
}

export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

/** Supabase inglizcha xatolarini o'zbekchaga aylantirish. */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already")) {
    return "Bu email allaqachon ro'yxatdan o'tgan. Kirishni sinab ko'ring.";
  }
  if (m.includes("email not confirmed")) {
    return "Email tasdiqlanmagan. Pochtangizdagi 6 xonali kodni kiriting.";
  }
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "Email yoki parol noto'g'ri.";
  }
  if (m.includes("password") && (m.includes("at least") || m.includes("6"))) {
    return "Parol kamida 6 ta belgidan iborat bo'lishi kerak.";
  }
  if (
    m.includes("invalid otp") ||
    m.includes("invalid token") ||
    m.includes("token has expired") ||
    m.includes("otp has expired") ||
    (m.includes("expired") && m.includes("token"))
  ) {
    return "Kod noto'g'ri yoki muddati o'tgan. Qayta yuboring.";
  }
  if (m.includes("rate limit") || m.includes("for security purposes") || m.includes("only request this after")) {
    return "Juda ko'p urinish. Biroz kutib, qayta urinib ko'ring.";
  }
  if (m.includes("unable to validate email") || m.includes("invalid email") || m.includes("email address")) {
    return "Email manzili noto'g'ri.";
  }
  if (m.includes("signup is disabled")) {
    return "Ro'yxatdan o'tish hozircha yopiq.";
  }
  if (m.includes("same email") || m.includes("email change")) {
    return "Emailni o'zgartirishda xatolik.";
  }
  return message;
}

function siteOrigin(): string | undefined {
  return typeof window !== "undefined" ? window.location.origin : undefined;
}

function usernameFrom(user: User, fallbackEmail = ""): string {
  const meta = (user.user_metadata?.username as string | undefined)?.trim();
  if (meta) return meta;
  const email = user.email || fallbackEmail;
  return email.split("@")[0] || "user";
}

async function ensureProfile(user: User) {
  const username = usernameFrom(user);
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      username,
      xp: 0,
      level: 1,
      streak: 0,
      daily_goal: 20,
    });
  }
}

async function userFromSession(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null;
  const u = session.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", u.id)
    .maybeSingle();

  return {
    id: u.id,
    email: u.email || "",
    username: profile?.username || usernameFrom(u),
  };
}

/** Magic-link / PKCE `?code=` va `token_hash` ni sessiyaga aylantirish. */
async function consumeAuthRedirect() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  let cleaned = false;

  try {
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
      url.searchParams.delete("code");
      cleaned = true;
    } else if (tokenHash && type) {
      await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      url.searchParams.delete("token_hash");
      url.searchParams.delete("type");
      cleaned = true;
    }
  } catch (err) {
    console.error("Auth redirect error:", err);
  }

  if (cleaned) {
    const qs = url.searchParams.toString();
    window.history.replaceState({}, "", url.pathname + (qs ? `?${qs}` : "") + url.hash);
  }
}

export async function initAuth(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    notify(null);
    return null;
  }

  if (authStarted) return currentUser;
  authStarted = true;

  await consumeAuthRedirect();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = await userFromSession(session);
  notify(user);

  supabase.auth.onAuthStateChange((event, nextSession) => {
    // getSession bilan deadlock bo'lmasligi uchun async ishni kechiktiramiz.
    if (event === "INITIAL_SESSION") return;
    setTimeout(async () => {
      if (event === "SIGNED_OUT") {
        notify(null);
        return;
      }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        if (nextSession?.user) {
          await ensureProfile(nextSession.user);
        }
        notify(await userFromSession(nextSession));
      }
    }, 0);
  });

  return user;
}

export async function register(
  email: string,
  password: string,
  username: string,
): Promise<AuthResult> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: siteOrigin(),
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    // Mavjud foydalanuvchi — email enumeration'dan himoya uchun bo'sh identities.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        success: false,
        error: "Bu email allaqachon ro'yxatdan o'tgan. Kirishni sinab ko'ring.",
      };
    }

    if (data.session?.user) {
      await ensureProfile(data.session.user);
      return { success: true, needsVerification: false };
    }

    // Confirm email + OTP: sessiya yo'q, kod kiritilishi kerak.
    return { success: true, needsVerification: true };
  } catch {
    return { success: false, error: "Ro'yxatdan o'tishda xatolik" };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const needsVerification = /email not confirmed/i.test(error.message);
      if (needsVerification) {
        await supabase.auth.resend({ type: "signup", email: cleanEmail });
        return {
          success: false,
          needsVerification: true,
          error: mapAuthError(error.message),
        };
      }
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Kirishda xatolik" };
  }
}

export async function verifyEmailOtp(email: string, token: string): Promise<AuthResult> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const code = token.replace(/\s/g, "");

    let { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: code,
      type: "signup",
    });

    // Ba'zi shablonlar `email` turidagi OTP yuboradi — fallback.
    if (error) {
      const retry = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: code,
        type: "email",
      });
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    if (data.user) {
      await ensureProfile(data.user);
      notify(await userFromSession(data.session ?? null) ?? {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        username: usernameFrom(data.user, cleanEmail),
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Kodni tekshirishda xatolik" };
  }
}

export async function resendSignupOtp(email: string): Promise<AuthResult> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: cleanEmail,
    });
    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Kodni qayta yuborishda xatolik" };
  }
}

export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: siteOrigin(),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Google bilan kirishda xatolik" };
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  notify(null);
}

export async function deleteAccount(): Promise<AuthResult> {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Foydalanuvchi topilmadi" };

  try {
    await supabase.from("progress").delete().eq("user_id", user.id);
    await supabase.from("achievements").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    notify(null);
    return { success: true };
  } catch {
    return { success: false, error: "Hisobni o'chirishda xatolik" };
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: siteOrigin() ? `${siteOrigin()}/` : undefined,
    });
    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Parol tiklashda xatolik" };
  }
}
