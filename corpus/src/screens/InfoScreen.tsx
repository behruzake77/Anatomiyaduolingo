"use client";

import { Shield, FileText, Info, BookOpen } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { TopBar } from "@/components/layout/TopBar";
import { useAppStore, type InfoSection } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

const META: Record<InfoSection, { title: string; icon: typeof Info }> = {
  about: { title: "about", icon: Info },
  terms: { title: "terms", icon: FileText },
  privacy: { title: "privacy", icon: Shield },
};

export function InfoScreen() {
  const t = useStrings();
  const section = useAppStore((s) => s.infoSection);
  const meta = META[section];
  const body = t[`${section}Body`] ?? t.aboutBody;

  return (
    <Screen padded={false}>
      <TopBar title={t[meta.title]} />
      <div className="px-5 pb-28">
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <meta.icon className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="break-words text-2xl font-semibold leading-tight">{t[meta.title]}</h1>
        </div>

        {section === "about" && (
          <Card className="mt-4 flex items-center gap-3 p-4">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="min-w-0 break-words text-sm text-muted">{t.infoSource}</p>
          </Card>
        )}

        <div className="mt-4 space-y-3">
          {body
            .split("\n")
            .filter((p) => p.trim().length > 0)
            .map((p, i) => (
              <p key={i} className="break-words text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
        </div>

        {section === "about" && (
          <p className="mt-6 break-words text-center text-xs text-muted">
            {t.infoVersion}: 1.0.0
          </p>
        )}
      </div>
    </Screen>
  );
}
