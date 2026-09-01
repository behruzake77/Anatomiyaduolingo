"use client";

import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore, type ScreenId, type Tab } from "@/store/useAppStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { ErrorBoundary } from "@/components/error-boundary";
import { applyDeviceClass, isLowEndDevice } from "@/lib/device";
import { SplashScreen } from "@/screens/SplashScreen";

function screen(loader: () => Promise<{ default: ComponentType }>) {
  return lazy(loader);
}

const LoginScreen = screen(() =>
  import("@/screens/LoginScreen").then((m) => ({ default: m.LoginScreen })),
);
const OnboardingScreen = screen(() =>
  import("@/screens/OnboardingScreen").then((m) => ({ default: m.OnboardingScreen })),
);
const DashboardScreen = screen(() =>
  import("@/screens/DashboardScreen").then((m) => ({ default: m.DashboardScreen })),
);
const TopicsScreen = screen(() =>
  import("@/screens/TopicsScreen").then((m) => ({ default: m.TopicsScreen })),
);
const LessonsScreen = screen(() =>
  import("@/screens/LessonsScreen").then((m) => ({ default: m.LessonsScreen })),
);
const LessonScreen = screen(() =>
  import("@/screens/LessonScreen").then((m) => ({ default: m.LessonScreen })),
);
const ReviewScreen = screen(() =>
  import("@/screens/ReviewScreen").then((m) => ({ default: m.ReviewScreen })),
);
const ResultCorrectScreen = screen(() =>
  import("@/screens/ResultCorrectScreen").then((m) => ({ default: m.ResultCorrectScreen })),
);
const ResultWrongScreen = screen(() =>
  import("@/screens/ResultWrongScreen").then((m) => ({ default: m.ResultWrongScreen })),
);
const ProfileScreen = screen(() =>
  import("@/screens/ProfileScreen").then((m) => ({ default: m.ProfileScreen })),
);
const AchievementsScreen = screen(() =>
  import("@/screens/AchievementsScreen").then((m) => ({ default: m.AchievementsScreen })),
);
const StudyModeScreen = screen(() =>
  import("@/screens/StudyModeScreen").then((m) => ({ default: m.StudyModeScreen })),
);
const Models3DScreen = screen(() =>
  import("@/screens/Models3DScreen").then((m) => ({ default: m.Models3DScreen })),
);
const ProgressScreen = screen(() =>
  import("@/screens/ProgressScreen").then((m) => ({ default: m.ProgressScreen })),
);
const SettingsScreen = screen(() =>
  import("@/screens/SettingsScreen").then((m) => ({ default: m.SettingsScreen })),
);
const GlossaryScreen = screen(() =>
  import("@/screens/GlossaryScreen").then((m) => ({ default: m.GlossaryScreen })),
);
const ExamScreen = screen(() =>
  import("@/screens/ExamScreen").then((m) => ({ default: m.ExamScreen })),
);
const BookmarksScreen = screen(() =>
  import("@/screens/BookmarksScreen").then((m) => ({ default: m.BookmarksScreen })),
);
const LibraryScreen = screen(() =>
  import("@/screens/LibraryScreen").then((m) => ({ default: m.LibraryScreen })),
);
const LeaderboardScreen = screen(() =>
  import("@/screens/LeaderboardScreen").then((m) => ({ default: m.LeaderboardScreen })),
);
const InfoScreen = screen(() =>
  import("@/screens/InfoScreen").then((m) => ({ default: m.InfoScreen })),
);
const PremiumScreen = screen(() =>
  import("@/screens/PremiumScreen").then((m) => ({ default: m.PremiumScreen })),
);
const BattleScreen = screen(() =>
  import("@/screens/BattleScreen").then((m) => ({ default: m.BattleScreen })),
);
const KahootScreen = screen(() =>
  import("@/screens/KahootScreen").then((m) => ({ default: m.KahootScreen })),
);
const AdminScreen = screen(() =>
  import("@/screens/AdminScreen").then((m) => ({ default: m.AdminScreen })),
);
const FeedbackScreen = screen(() =>
  import("@/screens/FeedbackScreen").then((m) => ({ default: m.FeedbackScreen })),
);
const InboxScreen = screen(() =>
  import("@/screens/InboxScreen").then((m) => ({ default: m.InboxScreen })),
);
const QuizStudioScreen = screen(() =>
  import("@/screens/QuizStudioScreen").then((m) => ({ default: m.QuizStudioScreen })),
);
const UserProfileScreen = screen(() =>
  import("@/screens/UserProfileScreen").then((m) => ({ default: m.UserProfileScreen })),
);

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
  "user-profile": UserProfileScreen,
};

const TABS: ScreenId[] = ["dashboard", "topics", "library", "profile"];
const NAV_SCREENS: ScreenId[] = [...TABS, "lessons"];

const TAB_SCREEN: Record<Tab, ScreenId> = {
  home: "dashboard",
  learn: "topics",
  library: "library",
  profile: "profile",
};

function ScreenFallback() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-primary/40" />
      <p className="mt-3 text-sm text-muted">Yuklanmoqda…</p>
    </div>
  );
}

export function AppNavigator() {
  const screenId = useAppStore((s) => s.screen);
  const tab = useAppStore((s) => s.tab);
  const darkMode = useAppStore((s) => s.settings.darkMode);
  const initAuth = useAppStore((s) => s.initAuth);
  const lowEnd = isLowEndDevice();

  useEffect(() => {
    applyDeviceClass();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    useAppStore.getState().syncLeague();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = new URLSearchParams(window.location.search).get("screen");
    const safe = [
      "topics",
      "library",
      "leaderboard",
      "profile",
      "glossary",
      "exam",
      "battle",
      "kahoot",
    ];
    if (target && safe.includes(target)) {
      useAppStore.getState().navigate(target as ScreenId);
    }
  }, []);

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

  useEffect(() => {
    if (screenId in TAB_SCREEN || TABS.includes(screenId)) {
      const found = (Object.keys(TAB_SCREEN) as Tab[]).find((t) => TAB_SCREEN[t] === screenId);
      if (found && found !== tab) useAppStore.setState({ tab: found });
    }
  }, [screenId, tab]);

  const Screen = SCREENS[screenId];
  const showNav = NAV_SCREENS.includes(screenId);

  const body = Screen ? (
    <ErrorBoundary resetKey={screenId}>
      <Suspense fallback={<ScreenFallback />}>
        <Screen />
      </Suspense>
    </ErrorBoundary>
  ) : null;

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-1 flex-col overflow-hidden bg-bg shadow-[0_0_60px_rgba(0,0,0,0.06)]">
      {lowEnd ? (
        <div key={screenId} className="flex min-h-0 flex-1 flex-col">
          {body}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={screenId}
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      )}

      {showNav && <BottomNav />}
    </div>
  );
}
