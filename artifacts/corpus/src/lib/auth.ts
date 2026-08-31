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
  birthYear: number | null;
}

let passwordRecovery = false;

export function isPasswordRecovery(): boolean {
  return passwordRecovery;
}

export function clearPasswordRecovery(): void {
  passwordRecovery = false;
}

export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/\s+/g, "_").slice(0, 20);
}

export function validUsername(raw: string): boolean {
  const n = normalizeUsername(raw);
  return n.length >= 3 && /^[A-Za-z0-9._]+$/.test(n);
}

export async function isUsernameTaken(name: string, exceptId?: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const n = normalizeUsername(name);
  if (!n) return true;
  try {
    // Username tekshiruvi auth so'rovini to'sib qo'ymasligi kerak. Ayniqsa eski
    // Android WebView'larda profiles so'rovi javobsiz qolishi mumkin.
    const query = supabase.from("profiles").select("id, username").ilike("username", n).limit(8);
    const timeout = new Promise<never>((_, reject) =>
      window.setTimeout(() => reject(new Error("username check timeout")), 8000),
    );
    const { data } = await Promise.race([query, timeout]);
    return (data ?? []).some((row) => row.id !== exceptId && String(row.username).toLowerCase() === n.toLowerCase());
  } catch {
    // Auth signup baribir ishlashi mumkin; unique constraint xatosi signup'dan qaytadi.
    return false;
  }
}

async function uniqueUsername(base: string, exceptId?: string): Promise<string> {
  let name = normalizeUsername(base) || "user";
  if (!(await isUsernameTaken(name, exceptId))) return name;
  for (let i = 0; i < 12; i++) {
    const cand = `${name.slice(0, 16)}${Math.floor(10 + Math.random() * 89)}`;
    if (!(await isUsernameTaken(cand, exceptId))) return cand;
  }
  return `${name.slice(0, 12)}${Date.now().toString().slice(-6)}`;
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
  if (m.includes("signup is disabled") || m.includes("email provider is disabled") || m.includes("email provider")) {
    return "Email orqali ro'yxatdan o'tish Supabase sozlamalarida yoqilmagan.";
  }
  if (m.includes("email rate limit") || m.includes("email sending")) {
    return "Tasdiqlash emailini yuborib bo'lmadi. Supabase email sozlamalarini tekshiring.";
  }
  if (
    m.includes("provider") &&
    (m.includes("not enabled") || m.includes("unsupported") || m.includes("disabled"))
  ) {
    return "Google orqali kirish Supabase Auth sozlamalarida yoqilmagan.";
  }
  if (m.includes("same email") || m.includes("email change")) {
    return "Emailni o'zgartirishda xatolik.";
  }
  return message;
}

function siteOrigin(): string | undefined {
  return typeof window !== "undefined" ? window.location.origin : undefined;
}

/**
 * Eski (Supabase'dan oldingi) mahalliy localStorage auth tizimining qoldiqlarini
 * tozalaydi. O'sha eski tizim `src/auth.ts` da edi va `corpus-auth` kalitida
 * ro'yxatdan o'tgan akkauntlar ro'yxatini saqlardi. Yangi tizim Supabase bo'lgani
 * uchun bu kalit endi foydasiz — loyihani "yangidan boshlash" uchun o'chiriladi.
 */
export function clearLegacyAuth(): void {
  if (typeof localStorage === "undefined") return;
  try {
    // Eski localStorage-based auth ma'lumotlari (o'lik tizim): har qanday nom bilan
    // bo'lgan `corpus-progress-*` kalitlarini ham o'chiramiz.
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith("corpus-progress-")) localStorage.removeItem(key);
    }
    localStorage.removeItem("corpus-auth");
    localStorage.removeItem("corpus-storage"); // eski non-remote fallback
  } catch {
    /* no-op */
  }
}

function usernameFrom(user: User, fallbackEmail = ""): string {
  const meta = (user.user_metadata?.username as string | undefined)?.trim();
  if (meta) return meta;
  const email = user.email || fallbackEmail;
  return email.split("@")[0] || "user";
}

function birthYearFrom(user: User): number | null {
  const raw = user.user_metadata?.birth_year ?? user.user_metadata?.birthYear;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1940 || n > new Date().getFullYear() - 10) return null;
  return Math.round(n);
}

async function ensureProfile(user: User) {
  const username = await uniqueUsername(usernameFrom(user), user.id);
  const birthYear = birthYearFrom(user);
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, username, birth_year")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      username,
      birth_year: birthYear,
      xp: 0,
      level: 1,
      streak: 0,
      daily_goal: 20,
    });
    return;
  }
  const patch: Record<string, unknown> = {};
  if (!existing.username) patch.username = username;
  if (existing.birth_year == null && birthYear) patch.birth_year = birthYear;
  if (Object.keys(patch).length) {
    await supabase.from("profiles").update(patch).eq("id", user.id);
  }
}

async function userFromSession(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null;
  const u = session.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, birth_year")
    .eq("id", u.id)
    .maybeSingle();

  return {
    id: u.id,
    email: u.email || "",
    username: profile?.username || usernameFrom(u),
    birthYear: profile?.birth_year ?? birthYearFrom(u),
  };
}

/** Magic-link / PKCE `?code=` va `token_hash` ni sessiyaga aylantirish. */
async function consumeAuthRedirect() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  if (type === "recovery") passwordRecovery = true;
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

  // Yangi Supabase tizimiga o'tishda eski mahalliy akkauntlarni bir marta tozalaymiz.
  clearLegacyAuth();

  await consumeAuthRedirect();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  // OAuth bilan kirgan yangi foydalanuvchida trigger hali ishlamagan bo'lsa ham
  // profil satri yaratiladi va keyingi progress sync yo'qolib ketmaydi.
  if (session?.user) {
    await ensureProfile(session.user);
  }
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
      if (event === "PASSWORD_RECOVERY") {
      passwordRecovery = true;
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
  birthYear?: number,
): Promise<AuthResult> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const name = normalizeUsername(username);
    if (!validUsername(name)) {
      return { success: false, error: "Username 3–20 belgi: harf, raqam, nuqta yoki _" };
    }
    if (await isUsernameTaken(name)) {
      return { success: false, error: "Bu username band. Boshqasini tanlang." };
    }
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { username: name, birth_year: birthYear ?? null },
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
        birthYear: birthYearFrom(data.user),
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
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase sozlanmagan. VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni kiriting.",
    };
  }

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
    // 1) Foydalanuvchining O'Z satrlarini RLS orqali o'chirish (anon kalit yetadi).
    //    `progress` va `achievements` jadvallaridagi qatorlar auth.users ga
    //    on delete cascade bo'lgani uchun, auth foydalanuvchisi o'chsa ham
    //    ular avtomatik tozalanadi.
    await supabase.from("progress").delete().eq("user_id", user.id);
    await supabase.from("achievements").delete().eq("user_id", user.id);
    await supabase.from("battles").delete().eq("host_id", user.id);
    await supabase.from("battles").delete().eq("guest_id", user.id);
    await supabase.from("kahoot_players").delete().eq("user_id", user.id);
    await supabase.from("kahoot_games").delete().eq("host_id", user.id);
    await supabase.from("question_reports").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // 2) auth.users qatorini o'chirish uchun service_role kerak (admin API).
    //    Brauzerda faqat anon kalit bo'lgani uchun bu best-effort bo'ladi:
    //    xato bo'lsa ham dastur foydalanuvchini mahalliy o'chiradi. To'liq
    //    o'chirish uchun SUPABASE_SETUP.md dagi Edge Function / SQL dan
    //    foydalaning.
    let adminError: string | null = null;
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      adminError = error?.message ?? null;
    } catch {
      adminError = "admin_delete_unavailable";
    }

    clearLegacyAuth();
    notify(null);
    return {
      success: true,
      ...(adminError
        ? { error: "Hisob ma'lumotlari o'chirildi. (Auth satrini to'liq o'chirish uchun server sozlamasi kerak.)" }
        : {}),
    };
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

export async function updatePassword(password: string): Promise<AuthResult> {
  try {
    if (password.length < 6) {
      return { success: false, error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak." };
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: mapAuthError(error.message) };
    passwordRecovery = false;
    return { success: true };
  } catch {
    return { success: false, error: "Parolni yangilashda xatolik" };
  }
}

export async function updateUsername(name: string): Promise<AuthResult> {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Foydalanuvchi topilmadi" };
  const clean = normalizeUsername(name);
  if (!validUsername(clean)) {
    return { success: false, error: "Username 3–20 belgi: harf, raqam, nuqta yoki _" };
  }
  if (await isUsernameTaken(clean, user.id)) {
    return { success: false, error: "Bu username band. Boshqasini tanlang." };
  }
  const { error } = await supabase.from("profiles").update({ username: clean }).eq("id", user.id);
  if (error) return { success: false, error: mapAuthError(error.message) };
  await supabase.auth.updateUser({ data: { username: clean } });
  notify({ ...user, username: clean });
  return { success: true };
}

export async function updateBirthYear(year: number): Promise<AuthResult> {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Foydalanuvchi topilmadi" };
  const y = Math.round(year);
  if (y < 1940 || y > new Date().getFullYear() - 10) {
    return { success: false, error: "Tug'ilgan yil noto'g'ri" };
  }
  const { error } = await supabase.from("profiles").update({ birth_year: y }).eq("id", user.id);
  if (error) return { success: false, error: mapAuthError(error.message) };
  await supabase.auth.updateUser({ data: { birth_year: y } });
  notify({ ...user, birthYear: y });
  return { success: true };
}
