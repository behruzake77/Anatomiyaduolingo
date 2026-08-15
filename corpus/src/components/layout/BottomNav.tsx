"use client";

import { Home, BookOpen, User, Settings, type LucideIcon } from "lucide-react";
import { useAppStore, type Tab } from "@/store/useAppStore";
import { useStrings, type Strings } from "@/i18n";
import { cn } from "@/utils/cn";

function items(t: Strings): { id: Tab; label: string; icon: LucideIcon }[] {
  return [
    { id: "home", label: t.home, icon: Home },
    { id: "learn", label: t.learn, icon: BookOpen },
    { id: "profile", label: t.profile, icon: User },
    { id: "settings", label: t.settings, icon: Settings },
  ];
}

export function BottomNav() {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);
  const t = useStrings();

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/90 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      {items(t).map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                active && "bg-primary/10",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
