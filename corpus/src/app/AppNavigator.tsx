"use client";

import { useEffect, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore, type ScreenId, type Tab } from "@/store/useAppStore";
import { BottomNav } from "@/components/layout/BottomNav";

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
};

/** Screens that show the bottom navigation bar. */
const TABS: ScreenId[] = ["dashboard", "topics", "profile", "settings"];

const TAB_SCREEN: Record<Tab, ScreenId> = {
  home: "dashboard",
  learn: "topics",
  profile: "profile",
  settings: "settings",
};

export function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const tab = useAppStore((s) => s.tab);
  const darkMode = useAppStore((s) => s.settings.darkMode);

  // Apply dark mode to <html> reactively.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Keep tab in sync when navigating to a tab screen.
  useEffect(() => {
    if (screen in TAB_SCREEN || TABS.includes(screen)) {
      const found = (Object.keys(TAB_SCREEN) as Tab[]).find((t) => TAB_SCREEN[t] === screen);
      if (found && found !== tab) useAppStore.setState({ tab: found });
    }
  }, [screen, tab]);

  const Screen = SCREENS[screen];
  const showNav = TABS.includes(screen);

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
          <Screen />
        </motion.div>
      </AnimatePresence>

      {showNav && <BottomNav />}
    </div>
  );
}
