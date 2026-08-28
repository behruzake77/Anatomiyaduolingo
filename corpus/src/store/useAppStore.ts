"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { evaluateAchievements } from "@/utils/achievements";
import { reviewCard, SRS_MASTERED_BOX, type SRSCard } from "@/utils/srs";
import { isValidPremiumCode, PREMIUM_DISABLED } from "@/data/premium";
import {
  LEAGUES,
  PROMOTE_SLOTS,
  DEMOTE_SLOTS,
  boardFor,
  userRank,
  userWeekXp,
  weekKeyOf,
} from "@/utils/league";
import {
  getCurrent,
  register as authRegister,
  login as authLogin,
  logout as authLogout,
  deleteCurrentAccount,
  progressKey,
  normalizeName,
} from "@/auth";

export type ScreenId =
  | "splash"
  | "login"
  | "onboarding"
  | "dashboard"
  | "topics"
  | "lessons"
  | "lesson"
  | "review"
  | "result-correct"
  | "result-wrong"
  | "profile"
  | "achievements"
  | "study"
  | "progress"
  | "settings"
  | "models3d"
  | "glossary"
  | "exam"
  | "bookmarks"
  | "library"
  | "leaderboard"
  | "info"
  | "premium";

export type Tab = "home" | "learn" | "library" | "profile";

export type InfoSection = "about" | "terms" | "privacy";

export interface Settings {
  darkMode: boolean;
  sound: boolean;
  notifications: boolean;
  haptics: boolean;
  language: "en" | "uz";
}

export interface LessonResult {
  lessonId: string;
  score: number;
  total: number;
  earned: number;
}

/** O'tgan hafta liga natijasi (ko'tarilish/tushish). */
export interface LeagueResult {
  weekKey: string; // natija qaysi hafta yakunida olingan (yangi haftoning kaliti)
  rank: number; // yakuniy o'rin
  from: number; // eski liga
  to: number; // yangi liga
  change: "up" | "down" | "stay";
}

/** Yangi foydalanuvchi uchun boshlang'ich holat — hammasi NOL. */
const freshProgress = {
  onboardingDone: false,
  xp: 0,
  dailyXp: 0,
  dailyGoal: 20,
  streak: 0,
  correct: 0,
  total: 0,
  completedLessons: [] as string[],
  completedTopics: [] as string[],
  achievements: [] as string[],
  lastResult: null as LessonResult | null,
  xpHistory: {} as Record<string, number>, // "YYYY-MM-DD" -> XP
  srs: {} as Record<string, SRSCard>, // savol kaliti -> SRS kartasi
  bookmarks: [] as string[], // xatcho'p qilingan savol kalitlari
  lastActiveDay: "", // oxirgi faol kun "YYYY-MM-DD" (seriya hisobi uchun)
  lastActiveAt: 0, // oxirgi faollik vaqti (ms) — maskot kayfiyati uchun
  leagueIndex: 0, // haftalik liga (0=Bronza … 4=Olmos)
  leagueWeekKey: "", // oxirgi sinxronlangan hafta "YYYY-Wnn"
  leagueResult: null as LeagueResult | null, // o'tgan hafta natijasi
  settings: {
    darkMode: false,
    sound: true,
    notifications: true,
    haptics: true,
    language: "uz",
  } as Settings,
  avatar: null as string | null,
  isPremium: false,
};

interface AppState {
  // navigation
  screen: ScreenId;
  tab: Tab;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  back: () => void;
  resetTo: (screen: ScreenId, backTo?: ScreenId[]) => void;
  setTab: (tab: Tab) => void;

  // auth
  currentUser: string | null;
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  deleteAccount: () => void;

  // progress (foydalanuvchiga xos, noldan boshlanadi)
  onboardingDone: boolean;
  xp: number;
  dailyXp: number;
  dailyGoal: number;
  streak: number;
  correct: number;
  total: number;
  completedLessons: string[];
  completedTopics: string[];
  achievements: string[];
  lastResult: LessonResult | null;
  xpHistory: Record<string, number>;
  srs: Record<string, SRSCard>;
  bookmarks: string[];
  lastActiveDay: string;
  lastActiveAt: number;

  // haftalik liga (reyting)
  leagueIndex: number;
  leagueWeekKey: string;
  leagueResult: LeagueResult | null;
  syncLeague: () => void;
  dismissLeagueResult: () => void;

  // settings
  settings: Settings;
  toggleSetting: (key: keyof Settings) => void;
  setLanguage: (lang: "en" | "uz") => void;

  // profil rasmi + ma'lumot ekrani
  avatar: string | null;
  setAvatar: (dataUrl: string | null) => void;
  infoSection: InfoSection;
  openInfo: (section: InfoSection) => void;

  // premium
  isPremium: boolean;
  activatePremium: (code: string) => boolean;
  deactivatePremium: () => void;

  // actions
  finishOnboarding: () => void;
  activeLessonId: string | null;
  activeSystemId: string | null;
  openLesson: (lessonId: string) => void;
  openSystem: (systemId: string) => void;
  completeLesson: (lessonId: string, topicId: string, score: number, totalQ: number) => LessonResult;
  recordAnswer: (key: string, correct: boolean) => void;
  toggleBookmark: (key: string) => void;
  touchActivity: () => void;
  resetProgress: () => void;
}

/** localStorage-ga joriy foydalanuvchi bo'yicha yo'naltiruvchi xom storage. */
const rawStorage = {
  getItem: (): string | null => {
    const u = getCurrent();
    if (!u) return null;
    try {
      return localStorage.getItem(progressKey(u));
    } catch {
      return null;
    }
  },
  setItem: (_name: string, value: string) => {
    const u = getCurrent();
    if (!u) return;
    try {
      localStorage.setItem(progressKey(u), value);
    } catch {
      /* no-op */
    }
  },
  removeItem: () => {
    const u = getCurrent();
    if (!u) return;
    try {
      localStorage.removeItem(progressKey(u));
    } catch {
      /* no-op */
    }
  },
};

/** Foydalanuvchining saqlangan progressini o'qish (login paytida). */
function loadProgressFor(username: string): Partial<AppState> {
  try {
    const raw = localStorage.getItem(progressKey(username));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed.state ?? {};
  } catch {
    return {};
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      screen: "splash",
      tab: "home",
      history: [],
      navigate: (screen) =>
        set((s) => ({ screen, history: [...s.history.slice(-19), s.screen] })),
      back: () =>
        set((s) => {
          const history = [...s.history];
          const prev = history.pop();
          return { screen: prev ?? "dashboard", history };
        }),
      resetTo: (screen, backTo) =>
        set({ screen, history: backTo ? [...backTo] : [] }),
      setTab: (tab) => {
        const screen: Record<Tab, ScreenId> = {
          home: "dashboard",
          learn: "topics",
          library: "library",
          profile: "profile",
        };
        set({ tab, screen: screen[tab], history: [] });
      },

      currentUser: getCurrent(),

      register: (username, password) => {
        if (!authRegister(username, password)) return false;
        set({
          currentUser: normalizeName(username),
          ...freshProgress,
          screen: "onboarding",
          tab: "home",
          history: [],
        });
        return true;
      },
      login: (username, password) => {
        if (!authLogin(username, password)) return false;
        const saved = loadProgressFor(username);
        set({
          currentUser: normalizeName(username),
          ...freshProgress,
          ...saved,
          screen: "dashboard",
          tab: "home",
          history: [],
        });
        return true;
      },
      logout: () => {
        authLogout();
        set({
          currentUser: null,
          ...freshProgress,
          screen: "login",
          tab: "home",
          history: [],
        });
      },

      /** Hisobni butunlay o'chiradi (hisob + progress) — Play siyosati talabi. */
      deleteAccount: () => {
        deleteCurrentAccount();
        set({
          currentUser: null,
          ...freshProgress,
          screen: "login",
          tab: "home",
          history: [],
        });
      },

      ...freshProgress,

      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
      setLanguage: (lang) => set((s) => ({ settings: { ...s.settings, language: lang } })),

      avatar: null,
      setAvatar: (dataUrl) => set({ avatar: dataUrl }),
      infoSection: "about",
      openInfo: (section) => {
        set({ infoSection: section });
        get().navigate("info");
      },

      isPremium: false,
      activatePremium: (code) => {
        if (PREMIUM_DISABLED) return false; // vaqtincha bloklangan — hammasi bepul
        if (!isValidPremiumCode(code)) return false;
        set({ isPremium: true });
        return true;
      },
      deactivatePremium: () => set({ isPremium: false }),

      finishOnboarding: () => set({ onboardingDone: true }),

      activeLessonId: null,
      activeSystemId: null,
      openLesson: (lessonId) => {
        set({ activeLessonId: lessonId });
        get().navigate("lesson");
      },
      openSystem: (systemId) => {
        set({ activeSystemId: systemId });
        get().navigate("lessons");
      },

      completeLesson: (lessonId, topicId, score, totalQ) => {
        const earned = Math.round(20 * (score / Math.max(1, totalQ)));
        const s = get();
        const completedLessons = s.completedLessons.includes(lessonId)
          ? s.completedLessons
          : [...s.completedLessons, lessonId];
        const completedTopics = s.completedTopics.includes(topicId)
          ? s.completedTopics
          : [...s.completedTopics, topicId];

        const snapshot = {
          streak: s.streak,
          correct: s.correct + score,
          total: s.total + totalQ,
          completedLessons: completedLessons.length,
          completedTopics: completedTopics.length,
        };
        const newly = evaluateAchievements(snapshot, s.achievements);

        const result: LessonResult = { lessonId, score, total: totalQ, earned };
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

        // Seriya (streak): yangi kunda birinchi faollik — kecha faol bo'lgan bo'lsa +1, aks holda 1.
        let streak = s.streak;
        let lastActiveDay = s.lastActiveDay;
        if (lastActiveDay !== today) {
          streak = lastActiveDay === yesterday ? streak + 1 : 1;
          lastActiveDay = today;
        }

        set({
          xp: s.xp + earned,
          dailyXp: s.dailyXp + earned,
          streak,
          lastActiveDay,
          lastActiveAt: Date.now(),
          correct: s.correct + score,
          total: s.total + totalQ,
          completedLessons,
          completedTopics,
          achievements: [...s.achievements, ...newly],
          lastResult: result,
          xpHistory: { ...s.xpHistory, [today]: (s.xpHistory[today] ?? 0) + earned },
        });
        return result;
      },

      touchActivity: () =>
        set((s) => ({ lastActiveAt: Date.now() })),

      /** Hafta almashganini tekshiradi: o'tgan hafta yakunlanadi (ko'tarilish/tushish). */
      syncLeague: () => {
        const s = get();
        const wk = weekKeyOf(new Date());
        if (s.leagueWeekKey === wk) return;

        const isFirstWeek = !s.leagueWeekKey;
        let leagueIndex = s.leagueIndex;
        let leagueResult: LeagueResult | null = null;

        if (!isFirstWeek) {
          const prevXp = userWeekXp(s.xpHistory, s.leagueWeekKey);
          const board = boardFor(s.leagueWeekKey, s.leagueIndex, s.currentUser ?? "", prevXp, {
            finalize: true,
          });
          const rank = userRank(board);
          let change: LeagueResult["change"] = "stay";
          if (rank <= PROMOTE_SLOTS && leagueIndex < LEAGUES.length - 1) {
            leagueIndex += 1;
            change = "up";
          } else if (rank > board.length - DEMOTE_SLOTS && leagueIndex > 0) {
            leagueIndex -= 1;
            change = "down";
          }
          leagueResult = { weekKey: wk, rank, from: s.leagueIndex, to: leagueIndex, change };
        }

        set({ leagueWeekKey: wk, leagueIndex, leagueResult });
      },

      dismissLeagueResult: () => set({ leagueResult: null }),

      recordAnswer: (key, correct) => {
        const s = get();
        const card = s.srs[key];
        // Yangi karta faqat XATO javobdan yaratiladi; karta bo'lmasa to'g'ri javob no-op.
        if (!card && correct) return;
        const updated = reviewCard(card, correct);
        // O'zlashtirilgan (yuqori qutidan to'g'ri) — kartani takrorlashdan chiqarish.
        if (correct && updated.box >= SRS_MASTERED_BOX) {
          const next = { ...s.srs };
          delete next[key];
          set({ srs: next });
          return;
        }
        set({ srs: { ...s.srs, [key]: updated } });
      },

      toggleBookmark: (key) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(key)
            ? s.bookmarks.filter((k) => k !== key)
            : [...s.bookmarks, key],
        })),

      resetProgress: () =>
        set((s) => ({
          ...freshProgress,
          settings: s.settings,
          currentUser: s.currentUser,
        })),
    }),
    {
      name: "corpus-storage",
      version: 6,
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Partial<AppState> & {
          srs?: Record<string, SRSCard>;
          bookmarks?: string[];
          lastActiveDay?: string;
          lastActiveAt?: number;
          avatar?: string | null;
          isPremium?: boolean;
          leagueIndex?: number;
          leagueWeekKey?: string;
          leagueResult?: LeagueResult | null;
        };
        // v1..v6: yangi maydonlar (SRS, bookmarks, lastActive, avatar, isPremium) qo'shiladi — progress saqlanadi.
        return {
          ...p,
          srs: p.srs ?? {},
          bookmarks: p.bookmarks ?? [],
          lastActiveDay: p.lastActiveDay ?? "",
          lastActiveAt: p.lastActiveAt ?? 0,
          avatar: p.avatar ?? null,
          isPremium: p.isPremium ?? false,
          leagueIndex: p.leagueIndex ?? 0,
          leagueWeekKey: p.leagueWeekKey ?? "",
          leagueResult: p.leagueResult ?? null,
        };
      },
      storage: createJSONStorage(() => rawStorage),
      partialize: (s) => ({
        onboardingDone: s.onboardingDone,
        xp: s.xp,
        dailyXp: s.dailyXp,
        dailyGoal: s.dailyGoal,
        streak: s.streak,
        correct: s.correct,
        total: s.total,
        completedLessons: s.completedLessons,
        completedTopics: s.completedTopics,
        achievements: s.achievements,
        xpHistory: s.xpHistory,
        srs: s.srs,
        bookmarks: s.bookmarks,
        lastActiveDay: s.lastActiveDay,
        lastActiveAt: s.lastActiveAt,
        leagueIndex: s.leagueIndex,
        leagueWeekKey: s.leagueWeekKey,
        leagueResult: s.leagueResult,
        settings: s.settings,
        avatar: s.avatar,
        isPremium: s.isPremium,
      }),
    },
  ),
);
