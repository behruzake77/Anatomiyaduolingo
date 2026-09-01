"use client";

import { Home, BookOpen, User, Library, type LucideIcon } from "lucide-react";
import { useAppStore, type Tab } from "@/store/useAppStore";
import { useStrings, type Strings } from "@/i18n";
import { cn } from "@/utils/cn";

function items(t: Strings): { id: Tab; label: string; icon: LucideIcon }[] {
  return [
    { id: "home", label: t.home, icon: Home },
    { id: "learn", label: t.learn, icon: BookOpen },
    { id: "library", label: t.library, icon: Library },
    { id: "profile", label: t.profile, icon: User },
  ];
}

export function BottomNav() {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);
  const t = useStrings();

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface/95 backdrop-blur-lg"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
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
              "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors active:scale-[.98]",
              active ? "text-primary" : "text-muted",
            )}
          >
            {active && (
              <span
                className="absolute left-1/2 top-0 h-[3px] w-8 -translate-x-1/2 rounded-b-full bg-primary"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "flex h-9 w-full max-w-[4.5rem] items-center justify-center rounded-2xl transition-colors",
                active && "bg-primary/10",
              )}
            >
              <Icon className="h-[22px] w-[22px]" aria-hidden />
            </span>
            <span className="max-w-full truncate px-1 leading-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
