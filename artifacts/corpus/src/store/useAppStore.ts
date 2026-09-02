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
import { levelFromXp } from "@/utils/levels";
import {
  initAuth as libInitAuth,
  onAuthChange,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  deleteAccount as authDeleteAccount,
  verifyEmailOtp as authVerifyOtp,
  resendSignupOtp as authResendOtp,
  updateUsername as authUpdateUsername,
  updateBirthYear as authUpdateBirthYear,
  isPasswordRecovery,
  type AuthUser,
  type AuthResult,
} from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { fetchIsAdmin, isAdminAccount } from "@/lib/reports";
import type { UserQuiz } from "@/lib/userQuizzes";

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
  | "premium"
  | "battle"
  | "kahoot"
  | "admin"
  | "feedback"
  | "inbox"
  | "quiz-studio"
  | "user-profile";

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

export interface LeagueResult {
  weekKey: string;
  rank: number;
  from: number;
  to: number;
  change: "up" | "down" | "stay";
}

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
  xpHistory: {} as Record<string, number>,
  srs: {} as Record<string, SRSCard>,
  bookmarks: [] as string[],
  lastActiveDay: "",
  lastActiveAt: 0,
  leagueIndex: 0,
  leagueWeekKey: "",
  leagueResult: null as LeagueResult | null,
  battlesWon: 0,
  battlesLost: 0,
  settings: {
    darkMode: false,
    sound: true,
    notifications: true,
    haptics: true,
    language: "uz",
  } as Settings,
  avatar: null as string | null,
  kahootName: "" as string,
  isPremium: false,
};

// LocalStorage fallback — Subabase not available bo'lsa
const localStorageFallback = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* no-op */
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* no-op */
    }
  },
};

// Supabase'ga progress saqlash
async function saveProgressToSupabase(userId: string, progress: Partial<typeof freshProgress>) {
  if (!isSupabaseConfigured) return;

  const wk = weekKeyOf(new Date());
  const weekXp = userWeekXp(progress.xpHistory ?? {}, wk);
  const base = {
    xp: progress.xp ?? 0,
    level: levelFromXp(progress.xp ?? 0),
    streak: progress.streak ?? 0,
    daily_goal: progress.dailyGoal ?? 20,
    last_activity: new Date().toISOString().split("T")[0],
  };
  const extra = {
    ...base,
    week_xp: weekXp,
    week_key: wk,
    league_index: progress.leagueIndex ?? 0,
    battles_won: progress.battlesWon ?? 0,
    battles_lost: progress.battlesLost ?? 0,
    avatar: progress.avatar ?? null,
  };

  try {
    const { error } = await supabase.from("profiles").update(extra).eq("id", userId);
    if (error) {
      const fallback = await supabase.from("profiles").update(base).eq("id", userId);
      if (fallback.error) console.error("Progress save error:", fallback.error);
    }
  } catch (err) {
    console.error("Supabase save error:", err);
  }
}

async function loadProgressFromSupabase(userId: string) {
  if (!isSupabaseConfigured) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    
    return {
      xp: data.xp ?? 0,
      streak: data.streak ?? 0,
      dailyGoal: data.daily_goal ?? 20,
      battlesWon: data.battles_won ?? 0,
      battlesLost: data.battles_lost ?? 0,
      isAdmin: Boolean(data.is_admin),
      avatar: (data.avatar as string | null) ?? null,
    };
  } catch (err) {
    console.error('Supabase load error:', err);
    return null;
  }
}

interface AppState {
  screen: ScreenId;
  tab: Tab;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  back: () => void;
  resetTo: (screen: ScreenId, backTo?: ScreenId[]) => void;
  setTab: (tab: Tab) => void;

  // auth
  currentUser: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  /** Boshqa foydalanuvchi profilini ko'rish (user-profile ekrani). */
  viewProfileUser: { id: string; username: string } | null;
  openUserProfile: (user: { id: string; username: string }) => void;
  closeUserProfile: () => void;
  register: (email: string, password: string, username: string, birthYear?: number) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyOtp: (email: string, token: string) => Promise<AuthResult>;
  resendOtp: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUsername: (name: string) => Promise<AuthResult>;
  updateBirthYear: (year: number) => Promise<AuthResult>;

  // progress
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

  // liga
  leagueIndex: number;
  leagueWeekKey: string;
  leagueResult: LeagueResult | null;
  syncLeague: () => void;
  dismissLeagueResult: () => void;
  battlesWon: number;
  battlesLost: number;
  recordBattle: (outcome: "win" | "lose" | "draw", earned: number) => void;
  recordKahoot: (earned: number) => void;
  publishProfile: () => void;

  // settings
  settings: Settings;
  toggleSetting: (key: keyof Settings) => void;
  setLanguage: (lang: "en" | "uz") => void;

  avatar: string | null;
  setAvatar: (dataUrl: string | null) => void;
  /** Kahoot o'yinlarida ko'rinadigan ism (bo'sh bo'lsa — username ishlatiladi) */
  kahootName: string;
  setKahootName: (name: string) => void;
  infoSection: InfoSection;
  openInfo: (section: InfoSection) => void;

  isPremium: boolean;
  activatePremium: (code: string) => boolean;
  deactivatePremium: () => void;

  finishOnboarding: () => void;
  activeLessonId: string | null;
  activeSystemId: string | null;
  battleScope: string;
  openLesson: (lessonId: string) => void;
  openSystem: (systemId: string) => void;
  openBattle: (scope?: string) => void;
  openKahoot: (scope?: string) => void;
  pendingKahootQuiz: UserQuiz | null;
  setPendingKahootQuiz: (quiz: UserQuiz | null) => void;
  openKahootQuiz: (quiz: UserQuiz) => void;
  openQuizStudio: () => void;
  setBattleScope: (scope: string) => void;
  completeLesson: (lessonId: string, topicId: string, score: number, totalQ: number) => LessonResult;
  recordAnswer: (key: string, correct: boolean) => void;
  toggleBookmark: (key: string) => void;
  touchActivity: () => void;
  resetProgress: () => void;
}

// Supabase configured bo'lsa — remote storage, aks holda — localStorage
const storageName = isSupabaseConfigured ? "corpus-storage-remote" : "corpus-storage";

let authBound = false;

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

      currentUser: null,
      isAdmin: false,
      isLoading: true,

      viewProfileUser: null,
      openUserProfile: (user) => {
        set({ viewProfileUser: user });
        get().navigate("user-profile");
      },
      closeUserProfile: () => set({ viewProfileUser: null }),

      initAuth: async () => {
        if (!isSupabaseConfigured) {
          set({ isLoading: false });
          return;
        }

        const applyUser = async (user: AuthUser | null) => {
          if (user) {
            const wasLoggedOut = !get().currentUser;
            const dbProgress = wasLoggedOut ? await loadProgressFromSupabase(user.id) : null;
            const flag = Boolean(dbProgress?.isAdmin) || isAdminAccount(user) || (await fetchIsAdmin(user.id));
            const s = get();
            const enterApp = s.screen === "login" && !isPasswordRecovery();
            const nextScreen = s.onboardingDone ? "dashboard" : "onboarding";
            const progress = dbProgress ? { ...dbProgress, isAdmin: flag } : { isAdmin: flag };
            set({
              currentUser: user,
              isLoading: false,
              ...progress,
              ...(enterApp ? { screen: nextScreen, tab: "home" as const, history: [] } : {}),
            });
          } else {
            const s = get();
            const stay = s.screen === "splash" || s.screen === "login";
            set({
              currentUser: null,
              isAdmin: false,
              isLoading: false,
              ...(stay ? {} : { screen: "login" as const, tab: "home" as const, history: [] }),
            });
          }
        };

        if (!authBound) {
          authBound = true;
          onAuthChange((user) => {
            void applyUser(user);
          });
          await libInitAuth();
        } else {
          set({ isLoading: false });
        }
      },

      register: async (email, password, username, birthYear?) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: "Supabase sozlanmagan" };
        }
        return authRegister(email, password, username, birthYear);
      },

      updateUsername: async (name) => authUpdateUsername(name),
      updateBirthYear: async (year) => authUpdateBirthYear(year),

      login: async (email, password) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: "Supabase sozlanmagan" };
        }
        return authLogin(email, password);
      },

      verifyOtp: async (email, token) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: "Supabase sozlanmagan" };
        }
        return authVerifyOtp(email, token);
      },

      resendOtp: async (email) => {
        if (!isSupabaseConfigured) {
          return { success: false, error: "Supabase sozlanmagan" };
        }
        return authResendOtp(email);
      },

      logout: async () => {
        await authLogout();
        set({
          currentUser: null,
          isAdmin: false,
          ...freshProgress,
          screen: "login",
        });
      },

      deleteAccount: async () => {
        await authDeleteAccount();
        set({
          currentUser: null,
          isAdmin: false,
          ...freshProgress,
          screen: "login",
        });
      },

      ...freshProgress,

      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
      setLanguage: (lang) => set((s) => ({ settings: { ...s.settings, language: lang } })),

      avatar: null,
      setAvatar: (dataUrl) => {
        set({ avatar: dataUrl });
        const u = get().currentUser;
        if (u && isSupabaseConfigured) {
          // Reytinglarda avatar ko'rinishi uchun Supabase'ga yozamiz.
          void supabase.from("profiles").update({ avatar: dataUrl }).eq("id", u.id).then(({ error }) => {
            if (error) console.error("Avatar save error:", error);
          });
        }
      },
      kahootName: "",
      setKahootName: (name) => {
        set({ kahootName: name.trim().slice(0, 20) });
      },
      infoSection: "about",
      openInfo: (section) => {
        set({ infoSection: section });
        get().navigate("info");
      },

      isPremium: false,
      activatePremium: (code) => {
        if (PREMIUM_DISABLED) return false;
        if (!isValidPremiumCode(code)) return false;
        set({ isPremium: true });
        return true;
      },
      deactivatePremium: () => set({ isPremium: false }),

      finishOnboarding: () => set({ onboardingDone: true }),

      activeLessonId: null,
      activeSystemId: null,
      battleScope: "all",
      openLesson: (lessonId) => {
        set({ activeLessonId: lessonId });
        get().navigate("lesson");
      },
      openSystem: (systemId) => {
        set({ activeSystemId: systemId });
        get().navigate("lessons");
      },
      setBattleScope: (scope) => set({ battleScope: scope || "all" }),
      openBattle: (scope) => {
        if (scope) set({ battleScope: scope });
        get().navigate("battle");
      },
      openKahoot: (scope) => {
        if (scope) set({ battleScope: scope, pendingKahootQuiz: null });
        get().navigate("kahoot");
      },
      pendingKahootQuiz: null,
      setPendingKahootQuiz: (quiz) => set({ pendingKahootQuiz: quiz }),
      openKahootQuiz: (quiz) => {
        set({ pendingKahootQuiz: quiz });
        get().navigate("kahoot");
      },
      openQuizStudio: () => get().navigate("quiz-studio"),

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

        let streak = s.streak;
        let lastActiveDay = s.lastActiveDay;
        if (lastActiveDay !== today) {
          streak = lastActiveDay === yesterday ? streak + 1 : 1;
          lastActiveDay = today;
        }

        const newState = {
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
        };

        set(newState);

        // Supabase'ga saqlash
        if (s.currentUser) {
          saveProgressToSupabase(s.currentUser.id, { ...s, ...newState });
        }

        return result;
      },

      touchActivity: () =>
        set((s) => ({ lastActiveAt: Date.now() })),

      syncLeague: () => {
        const s = get();
        const wk = weekKeyOf(new Date());
        if (s.leagueWeekKey === wk) return;

        const isFirstWeek = !s.leagueWeekKey;
        let leagueIndex = s.leagueIndex;
        let leagueResult: LeagueResult | null = null;

        if (!isFirstWeek) {
          const prevXp = userWeekXp(s.xpHistory, s.leagueWeekKey);
          const board = boardFor(s.leagueWeekKey, s.leagueIndex, s.currentUser?.username ?? "", prevXp, {
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

      recordBattle: (outcome, earned) => {
        const s = get();
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        let streak = s.streak;
        let lastActiveDay = s.lastActiveDay;
        if (lastActiveDay !== today) {
          streak = lastActiveDay === yesterday ? streak + 1 : 1;
          lastActiveDay = today;
        }
        const newState = {
          xp: s.xp + earned,
          dailyXp: s.dailyXp + earned,
          streak,
          lastActiveDay,
          lastActiveAt: Date.now(),
          battlesWon: s.battlesWon + (outcome === "win" ? 1 : 0),
          battlesLost: s.battlesLost + (outcome === "lose" ? 1 : 0),
          xpHistory: { ...s.xpHistory, [today]: (s.xpHistory[today] ?? 0) + earned },
        };
        set(newState);
        if (s.currentUser) {
          saveProgressToSupabase(s.currentUser.id, { ...s, ...newState });
        }
      },

      recordKahoot: (earned) => {
        const s = get();
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        let streak = s.streak;
        let lastActiveDay = s.lastActiveDay;
        if (lastActiveDay !== today) {
          streak = lastActiveDay === yesterday ? streak + 1 : 1;
          lastActiveDay = today;
        }
        const newState = {
          xp: s.xp + earned,
          dailyXp: s.dailyXp + earned,
          streak,
          lastActiveDay,
          lastActiveAt: Date.now(),
          xpHistory: { ...s.xpHistory, [today]: (s.xpHistory[today] ?? 0) + earned },
        };
        set(newState);
        if (s.currentUser) {
          saveProgressToSupabase(s.currentUser.id, { ...s, ...newState });
        }
      },

      publishProfile: () => {
        const s = get();
        if (s.currentUser) saveProgressToSupabase(s.currentUser.id, s);
      },

      recordAnswer: (key, correct) => {
        const s = get();
        const card = s.srs[key];
        if (!card && correct) return;
        const updated = reviewCard(card, correct);
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
      name: storageName,
      version: 8,
      migrate: (persisted) => persisted as AppState,
      storage: createJSONStorage(() => localStorageFallback),
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
        battlesWon: s.battlesWon,
        battlesLost: s.battlesLost,
        settings: s.settings,
        avatar: s.avatar,
        isPremium: s.isPremium,
      }),
    },
  ),
);
