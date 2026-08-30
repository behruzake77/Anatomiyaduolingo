/**
 * Haftalik ligalar — foydalanuvchilar orasida raqobat (reyting).
 *
 * Ilova offline ishlaydi (ma'lumot faqat qurilmada), shuning uchun raqiblar
 * deterministik "virtual o'quvchilar" sifatida, hafta kaliti (weekKey) asosida
 * generatsiya qilinadi. Ularning XP si hafta davomida barqaror o'sadi va
 * foydalanuvchi tempiga moslashadi — poyga har doim jonli bo'ladi.
 *
 * Foydalanuvchining haftalik XP si `xpHistory` dan (dushanbadan bugunga) yig'iladi.
 */

export interface LeagueDef {
  id: string;
  key: string; // i18n kaliti
  emoji: string;
  color: string;
  base: number; // raqiblar bazaviy tempo XP/hafta
}

/** 5 liga: Bronza → Olmos. Yuqori ligada raqiblar kuchli. */
export const LEAGUES: LeagueDef[] = [
  { id: "bronze", key: "leagueBronze", emoji: "🥉", color: "#CD7F32", base: 160 },
  { id: "silver", key: "leagueSilver", emoji: "🥈", color: "#9AA5B1", base: 300 },
  { id: "gold", key: "leagueGold", emoji: "🥇", color: "#F5C04E", base: 500 },
  { id: "platinum", key: "leaguePlatinum", emoji: "💎", color: "#38BDF8", base: 780 },
  { id: "diamond", key: "leagueDiamond", emoji: "🔷", color: "#8B6CFF", base: 1100 },
];

export const BOARD_SIZE = 15; // foydalanuvchi + 14 raqib
export const PROMOTE_SLOTS = 3; // top 3 yuqoriga ko'tariladi
export const DEMOTE_SLOTS = 3; // pastki 3 tushadi

const RIVAL_NAMES = [
  "Aziza", "Bekzod", "Dilnoza", "Sardor", "Nilufar", "Jasur", "Madina",
  "Ulug'bek", "Zarina", "Sherzod", "Kamola", "Doniyor", "Sevinch",
  "Otabek", "Gulnora", "Rustam", "Shahzoda", "Feruza", "Anvar", "Nodira",
];

/* ---------- vaqt: hafta dushanbadan boshlanadi ---------- */

function mondayOf(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // dushanba = 0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

/** "YYYY-Wnn" — hafta kaliti (dushanba boshlanishi). */
export function weekKeyOf(d: Date): string {
  const mon = mondayOf(d);
  const thu = new Date(mon);
  thu.setDate(mon.getDate() + 3); // ISO: kamida 4 kun hafta ichida bo'lsin
  const year = thu.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const wk = 1 + Math.round(((thu.getTime() - jan4.getTime()) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return `${year}-W${String(wk).padStart(2, "0")}`;
}

/** Haftaning dushanba sanasi (Date). */
export function weekStart(weekKey: string): Date {
  const m = /^(\d{4})-W(\d{2})$/.exec(weekKey);
  if (!m) return mondayOf(new Date());
  const year = Number(m[1]);
  const wk = Number(m[2]);
  const jan4 = new Date(year, 0, 4);
  const mon = mondayOf(jan4);
  mon.setDate(mon.getDate() + (wk - 1) * 7);
  return mon;
}

/** Keyingi dushanba 00:00 (hafta tugashi). */
export function nextWeekEnd(): Date {
  const mon = mondayOf(new Date());
  mon.setDate(mon.getDate() + 7);
  return mon;
}

/** Foydalanuvchining berilgan haftadagi XP si (xpHistory dan). */
export function userWeekXp(xpHistory: Record<string, number>, weekKey: string): number {
  const mon = weekStart(weekKey);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    sum += xpHistory[key] ?? 0;
  }
  return sum;
}

/* ---------- deterministik tasodif ---------- */

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hashSeed(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- raqiblar ---------- */

export interface BoardEntry {
  name: string;
  xp: number;
  isYou: boolean;
  hue: number; // avatar rangi
}

/** Haftaning o'tgan qismi (0..1). */
function weekProgress(): number {
  const start = mondayOf(new Date()).getTime();
  const now = Date.now();
  return Math.min(1, Math.max(0.02, (now - start) / (7 * 86400000)));
}

function rivalXp(
  seed: string,
  leagueIndex: number,
  userXp: number,
  progress: number,
  jitterSeed: string | null,
): number {
  const r = rng(seed);
  const base = LEAGUES[Math.min(leagueIndex, LEAGUES.length - 1)].base;
  const factor = 0.45 + r() * 1.3; // ba'zilari sust, ba'zilari kuchli
  const pull = userXp * (0.45 + r() * 1.0); // foydalanuvchi tempiga moslashadi
  const target = Math.round(base * factor + pull);
  let p = progress;
  if (jitterSeed) p = Math.min(1, Math.max(0.02, p + (rng(jitterSeed)() - 0.5) * 0.1));
  return Math.max(2, Math.round(target * p));
}

/**
 * Haftalik turnir jadvali: foydalanuvchi + 14 raqib, XP bo'yicha kamayish tartibida.
 * `finalize: true` — o'tgan haftaning yakuniy jadvali (progress = 1, jitter yo'q).
 */
export function boardFor(
  weekKey: string,
  leagueIndex: number,
  userName: string,
  userXp: number,
  opts: { finalize?: boolean } = {},
): BoardEntry[] {
  const pick = rng(`pick:${weekKey}:${leagueIndex}`);
  const pool = [...RIVAL_NAMES];
  const rivals: { name: string; xp: number; hue: number }[] = [];
  for (let i = 0; i < BOARD_SIZE - 1 && pool.length; i++) {
    const idx = Math.floor(pick() * pool.length);
    const name = pool.splice(idx, 1)[0];
    const seed = `${weekKey}:${leagueIndex}:${name}`;
    const xp = opts.finalize
      ? rivalXp(seed, leagueIndex, userXp, 1, null)
      : rivalXp(seed, leagueIndex, userXp, weekProgress(), `${seed}:${new Date().getDate()}`);
    rivals.push({ name, xp, hue: hashSeed(name) % 360 });
  }

  const you: BoardEntry = {
    name: userName || "Siz",
    xp: userXp,
    isYou: true,
    hue: 262,
  };

  return [
    ...rivals.map((r) => ({ name: r.name, xp: r.xp, isYou: false, hue: r.hue })),
    you,
  ].sort((a, b) => b.xp - a.xp || (a.isYou ? -1 : 1));
}

export function userRank(board: BoardEntry[]): number {
  return board.findIndex((e) => e.isYou) + 1;
}

/** Raqibning avatar fon rangi (HSL). */
export function hueColor(hue: number): string {
  return `hsl(${hue} 65% 45%)`;
}
