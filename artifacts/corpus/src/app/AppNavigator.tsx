"use client";

import { useEffect, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore, type ScreenId, type Tab } from "@/store/useAppStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { ErrorBoundary } from "@/components/error-boundary";

import { SplashScreen } from "@/screens/SplashScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { TopicsScreen } from "@/screens/TopicsScreen";
import { LessonsScreen } from "@/screens/LessonsScreen";
import { LessonScreen } from "@/screens/LessonScreen";
import { ReviewScreen } from "@/screens/ReviewScreen";
import { ResultCorrectScreen } from "@/screens/ResultCorrectScreen";
import { ResultWrongScreen } from "@/screens/ResultWrongScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { AchievementsScreen } from "@/screens/AchievementsScreen";
import { StudyModeScreen } from "@/screens/StudyModeScreen";
import { Models3DScreen } from "@/screens/Models3DScreen";
import { ProgressScreen } from "@/screens/ProgressScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { GlossaryScreen } from "@/screens/GlossaryScreen";
import { ExamScreen } from "@/screens/ExamScreen";
import { BookmarksScreen } from "@/screens/BookmarksScreen";
import { LibraryScreen } from "@/screens/LibraryScreen";
import { LeaderboardScreen } from "@/screens/LeaderboardScreen";
import { InfoScreen } from "@/screens/InfoScreen";
import { PremiumScreen } from "@/screens/PremiumScreen";
import { BattleScreen } from "@/screens/BattleScreen";
import { KahootScreen } from "@/screens/KahootScreen";
import { AdminScreen } from "@/screens/AdminScreen";
import { FeedbackScreen } from "@/screens/FeedbackScreen";
import { InboxScreen } from "@/screens/InboxScreen";
import { QuizStudioScreen } from "@/screens/QuizStudioScreen";

const SCREENS: Record<ScreenId, ComponentType> = {
  splash: SplashScreen,
  login: LoginScreen,
  onboarding: OnboardingScreen,
  dashboard: DashboardScreen,
  topics: TopicsScreen,
  lessons: LessonsScreen,
  lesson: LessonScreen,
  review: ReviewScreen,
  "result-correct": ResultCorrectScreen,
  "result-wrong": ResultWrongScreen,
  profile: ProfileScreen,
  achievements: AchievementsScreen,
  study: StudyModeScreen,
  models3d: Models3DScreen,
  progress: ProgressScreen,
  settings: SettingsScreen,
  glossary: GlossaryScreen,
  exam: ExamScreen,
  bookmarks: BookmarksScreen,
  library: LibraryScreen,
  leaderboard: LeaderboardScreen,
  info: InfoScreen,
  premium: PremiumScreen,
  battle: BattleScreen,
  kahoot: KahootScreen,
  admin: AdminScreen,
  feedback: FeedbackScreen,
  inbox: InboxScreen,
  "quiz-studio": QuizStudioScreen,
};

const TABS: ScreenId[] = ["dashboard", "topics", "library", "profile"];
const NAV_SCREENS: ScreenId[] = [...TABS, "lessons"];

const TAB_SCREEN: Record<Tab, ScreenId> = {
  home: "dashboard",
  learn: "topics",
  library: "library",
  profile: "profile",
};

export function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const tab = useAppStore((s) => s.tab);
  const darkMode = useAppStore((s) => s.settings.darkMode);
  const initAuth = useAppStore((s) => s.initAuth);

  // Apply dark mode to <html> reactively.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Initialize Supabase Auth
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Haftalik liga: hafta almashsa — o'tgan hafta yakunlanadi (ko'tarilish/tushish).
  useEffect(() => {
    useAppStore.getState().syncLeague();
  }, []);

  // PWA shortcut'lar (/ ?screen=topics …) — faqat ruxsat etilgan ekranlar.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = new URLSearchParams(window.location.search).get("screen");
    const safe = ["topics", "library", "leaderboard", "profile", "glossary", "exam", "battle", "kahoot"];
    if (target && safe.includes(target)) {
      useAppStore.getState().navigate(target as ScreenId);
    }
  }, []);

  // Android APK: tizim «Orqaga» tugmasi — ilova ichida orqaga qaytadi
  useEffect(() => {
    const w = window as unknown as { __corpusBack?: () => string };
    w.__corpusBack = () => {
      const s = useAppStore.getState();
      if (s.screen === "splash") return "false";
      if (s.history.length > 0) {
        s.back();
        return "true";
      }
      if (s.screen !== "dashboard") {
        s.setTab("home");
        return "true";
      }
      return "false";
    };
    return () => {
      delete w.__corpusBack;
    };
  }, []);

  // Keep tab in sync when navigating to a tab screen.
  useEffect(() => {
    if (screen in TAB_SCREEN || TABS.includes(screen)) {
      const found = (Object.keys(TAB_SCREEN) as Tab[]).find((t) => TAB_SCREEN[t] === screen);
      if (found && found !== tab) useAppStore.setState({ tab: found });
    }
  }, [screen, tab]);

  const Screen = SCREENS[screen];
  const showNav = NAV_SCREENS.includes(screen);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-bg shadow-[0_0_60px_rgba(0,0,0,0.06)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="flex min-h-dvh flex-1 flex-col"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {Screen ? (
            <ErrorBoundary resetKey={screen}>
              <Screen />
            </ErrorBoundary>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {showNav && <BottomNav />}
    </div>
  );
}
