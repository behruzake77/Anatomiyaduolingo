"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";
import { countUnreadBroadcasts, subscribeBroadcasts } from "@/lib/broadcasts";

export function InboxBell({ className }: { className?: string }) {
  const t = useStrings();
  const navigate = useAppStore((s) => s.navigate);
  const [n, setN] = useState(0);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      void countUnreadBroadcasts().then((c) => {
        if (alive) setN(c);
      });
    };
    refresh();
    const unsub = subscribeBroadcasts(refresh);
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      unsub();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => navigate("inbox")}
      aria-label={t.inboxTitle}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink transition active:scale-95",
        className,
      )}
    >
      <Bell className="h-5 w-5" aria-hidden />
      {n > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
          {n > 9 ? "9+" : n}
        </span>
      )}
    </button>
  );
}
