"use client";

import { BookOpen, Bot, Home, Library, Settings, Trophy, User, type LucideIcon } from "lucide-react";
import { useAppStore, type ScreenId } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

export function DesktopNav() {
  const screen = useAppStore((state) => state.screen);
  const navigate = useAppStore((state) => state.navigate);
  const t = useStrings();
  const items: { id: ScreenId; label: string; icon: LucideIcon }[] = [
    { id: "dashboard", label: t.home, icon: Home },
    { id: "topics", label: t.learn, icon: BookOpen },
    { id: "library", label: t.library, icon: Library },
    { id: "leaderboard", label: "Reyting", icon: Trophy },
    { id: "tutor", label: "AI Tutor", icon: Bot },
    { id: "profile", label: t.profile, icon: User },
  ];

  return (
    <aside className="desktop-sidebar" aria-label="Desktop navigatsiya">
      <div className="desktop-brand"><span className="desktop-brand-mark">✦</span><span>CORPUS</span></div>
      <p className="desktop-nav-caption">O‘RGANISH MARKAZI</p>
      <nav className="desktop-nav-list">
        {items.map(({ id, label, icon: Icon }) => {
          const active = screen === id || (id === "dashboard" && screen === "splash");
          return <button key={id} onClick={() => navigate(id)} className={cn("desktop-nav-item", active && "is-active")} aria-current={active ? "page" : undefined}>
            <Icon className="h-5 w-5" aria-hidden /><span>{label}</span>
          </button>;
        })}
      </nav>
      <div className="desktop-nav-spacer" />
      <button className="desktop-nav-item desktop-settings" onClick={() => navigate("settings")}><Settings className="h-5 w-5" aria-hidden /><span>Sozlamalar</span></button>
      <div className="desktop-nav-footer"><span className="desktop-status-dot" /> CORPUS v1.0</div>
    </aside>
  );
}
