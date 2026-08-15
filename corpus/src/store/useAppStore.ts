"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { evaluateAchievements } from "@/utils/achievements";

export type ScreenId =
  | "splash"
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

interface AppState {
  // navigation
  screen: ScreenId;
  tab: Tab;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  back: () => void;
  setTab: (tab: Tab) => void;

  // onboarding
  onboardingDone: boolean;
  finishOnboarding: () => void;

  // gamification / progress
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
  completeLesson: (lessonId: string, topicId: string, score: number, totalQ: number) => LessonResult;
  resetProgress: () => void;
}

const seed = {
  xp: 1200,
  dailyXp: 15,
  dailyGoal: 20,
  streak: 7,
  correct: 100,
  total: 120,
  completedLessons: ["sk-1", "sk-2", "sk-3", "mu-1", "di-1", "re-1", "ne-1", "ci-1"],
  completedTopics: ["skeletal", "muscular", "digestive"],
  achievements: ["first_steps", "week_warrior", "knowledgeable"],
};

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

      onboardingDone: false,
      finishOnboarding: () => set({ onboardingDone: true }),

      ...seed,

      lastResult: null,

      settings: {
        darkMode: false,
        sound: true,
        notifications: true,
        haptics: true,
        language: "uz",
      },
      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
      setLanguage: (lang) => set((s) => ({ settings: { ...s.settings, language: lang } })),

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
          ...seed,
          lastResult: null,
          onboardingDone: s.onboardingDone,
          settings: s.settings,
        })),
    }),
    {
      name: "corpus-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        // v0/v1 → v2: o'zbekcha endi ASOSIY til.
        // Eski brauzerlarda saqlangan "language: en" yangi default ustidan yozilmasligi uchun
        // migratsiyada til majburiy "uz" ga o'tkaziladi (foydalanuvchi sozlashda qayta tanlashi mumkin).
        const s = (persistedState ?? {}) as Partial<AppState>;
        if (version < 2) {
          return {
            ...s,
            settings: {
              darkMode: s.settings?.darkMode ?? false,
              sound: s.settings?.sound ?? true,
              notifications: s.settings?.notifications ?? true,
              haptics: s.settings?.haptics ?? true,
              language: "uz",
            },
          };
        }
        return s as AppState;
      },
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
