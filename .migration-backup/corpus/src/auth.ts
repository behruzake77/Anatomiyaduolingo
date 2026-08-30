"use client";

/**
 * Oddiy mahalliy avtorizatsiya (localStorage).
 * Foydalanuvchilar ro'yxati + joriy sessiya `corpus-auth` kalitida,
 * har bir foydalanuvchining progressi esa `corpus-progress-<username>` da saqlanadi.
 */

export interface AuthUser {
  username: string;
  password: string;
}

interface AuthData {
  users: AuthUser[];
  current: string | null;
}

const AUTH_KEY = "corpus-auth";

function read(): AuthData {
  if (typeof localStorage === "undefined") return { users: [], current: null };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    const d = raw ? JSON.parse(raw) : null;
    return d && Array.isArray(d.users) ? d : { users: [], current: null };
  } catch {
    return { users: [], current: null };
  }
}

function write(d: AuthData) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(d));
  } catch {
    /* no-op */
  }
}

export function normalizeName(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getUsers(): AuthUser[] {
  return read().users;
}

export function getCurrent(): string | null {
  return read().current;
}

export function progressKey(username: string): string {
  return `corpus-progress-${normalizeName(username)}`;
}

/** Yangi foydalanuvchi yaratadi va sessiyani ochadi. Nom band bo'lsa false. */
export function register(username: string, password: string): boolean {
  const uname = normalizeName(username);
  if (!uname || !password) return false;
  const d = read();
  if (d.users.some((u) => u.username === uname)) return false;
  d.users.push({ username: uname, password });
  d.current = uname;
  write(d);
  return true;
}

/** Mavjud foydalanuvchini tekshiradi va sessiya ochadi. */
export function login(username: string, password: string): boolean {
  const uname = normalizeName(username);
  const d = read();
  const u = d.users.find((x) => x.username === uname);
  if (!u || u.password !== password) return false;
  d.current = uname;
  write(d);
  return true;
}

/** Joriy sessiyani yopadi (progress saqlanib qoladi). */
export function logout() {
  const d = read();
  d.current = null;
  write(d);
}

/**
 * Joriy foydalanuvchini BUTUNLAY o'chiradi: hisob + uning progressi.
 * (Google Play siyosati: hisob yaratish imkoni bo'lsa — o'chirish ham bo'lishi shart.)
 */
export function deleteCurrentAccount(): boolean {
  const d = read();
  if (!d.current) return false;
  const uname = d.current;
  d.users = d.users.filter((u) => u.username !== uname);
  d.current = null;
  write(d);
  try {
    localStorage.removeItem(progressKey(uname));
    localStorage.removeItem("corpus-storage"); // zustand persist (joriy holat)
  } catch {
    /* no-op */
  }
  return true;
}
