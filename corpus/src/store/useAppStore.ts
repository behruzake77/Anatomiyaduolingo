"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { evaluateAchievements } from "@/utils/achievements";
import {
  getCurrent,
  register as authRegister,
  login as authLogin,
  logout as authLogout,
  progressKey,
  normalizeName,
} from "@/auth";

export type ScreenId =
  | "splash"
  | "login"
  | "onboarding"
  | "dashboard"
  | "topics"
  | "lesson"
  | "result-correct"
  | "result-wrong"
  | "profile"
  | "achievements"
  | "study"
  | "progress"
  | "settings";

export type Tab = "home" | "learn" | "profile" | "settings";

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
  settings: {
    darkMode: false,
    sound: true,
    notifications: true,
    haptics: true,
    language: "uz",
  } as Settings,
};

interface AppState {
  // navigation
  screen: ScreenId;
  tab: Tab;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  back: () => void;
  setTab: (tab: Tab) => void;

  // auth
  currentUser: string | null;
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

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

  // settings
  settings: Settings;
  toggleSetting: (key: keyof Settings) => void;
  setLanguage: (lang: "en" | "uz") => void;

  // actions
  finishOnboarding: () => void;
  completeLesson: (lessonId: string, topicId: string, score: number, totalQ: number) => LessonResult;
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
      setTab: (tab) => {
        const screen: Record<Tab, ScreenId> = {
          home: "dashboard",
          learn: "topics",
          profile: "profile",
          settings: "settings",
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

      ...freshProgress,

      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
      setLanguage: (lang) => set((s) => ({ settings: { ...s.settings, language: lang } })),

      finishOnboarding: () => set({ onboardingDone: true }),

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

        set({
          xp: s.xp + earned,
          dailyXp: s.dailyXp + earned,
          correct: s.correct + score,
          total: s.total + totalQ,
          completedLessons,
          completedTopics,
          achievements: [...s.achievements, ...newly],
          lastResult: result,
        });
        return result;
      },

      resetProgress: () =>
        set((s) => ({
          ...freshProgress,
          settings: s.settings,
          currentUser: s.currentUser,
        })),
    }),
    {
      name: "corpus-storage",
      version: 1,
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
        settings: s.settings,
      }),
    },
  ),
);
