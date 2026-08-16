"use client";

import { useState } from "react";
import { Box, RotateCw } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Screen } from "@/components/layout/Screen";
import { Card } from "@/components/ui/Card";
import { MODELS_3D, type Model3D } from "@/data/models3d";
import { useStrings } from "@/i18n";
import { cn } from "@/utils/cn";

/**
 * Haqiqiy interaktiv 3D modellar (Sketchfab / AnatomyTOOL).
 * Har bir model faqat ochilganda (lazy) yuklanadi.
 */
export function Models3DScreen() {
  const t = useStrings();
  const [active, setActive] = useState<Model3D | null>(null);

  if (active) {
    return <Model3DViewer model={active} onBack={() => setActive(null)} />;
  }

  return (
    <Screen padded={false}>
      <TopBar title="3D modellar" />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">
          Suyaklarni haqiqiy 3D ko'rinishda aylantirib, kattalashtirib o'rganing.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {MODELS_3D.map((m) => (
            <Card key={m.id} onClick={() => setActive(m)} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Box className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight">
                    {m.title} <span className="italic text-primary">· {m.latin}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{m.description}</p>
                  <p className="mt-1 text-[11px] text-muted">Manba: {m.source}</p>
                </div>
                <RotateCw className="h-5 w-5 shrink-0 text-muted" aria-hidden />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/** Bitta modelning to'liq ekranli 3D ko'ruvchisi. */
function Model3DViewer({ model, onBack }: { model: Model3D; onBack: () => void }) {
  const t = useStrings();
  const [loaded, setLoaded] = useState(false);

  return (
    <Screen padded={false}>
      <TopBar title={model.title} />
      <div className="flex flex-col px-5 pb-28">
        {/* 3D ko'ruvchi (lazy) */}
        <div className="relative mt-2 h-[420px] overflow-hidden rounded-3xl border border-line bg-[#1b1633]">
          {!loaded ? (
            <button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#B9B4E0]"
            >
              <Box className="h-12 w-12" aria-hidden />
              <span className="text-base font-semibold text-white">3D modelni yuklash</span>
              <span className="text-sm">Aylantirish · Kattalashtirish · Yorliqlar</span>
              <span className="rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-pop">
                3D KO'RISH
              </span>
            </button>
          ) : (
            <iframe
              title={model.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&ui_watermark=0&ui_hint=1`}
            />
          )}
        </div>

        {/* ma'lumot */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            {model.title} <span className="italic text-primary">{model.latin}</span>
          </h2>
          <p className="mt-1 text-sm text-muted">{model.description}</p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-surface2 px-3 py-1.5 text-xs text-muted">
            Manba: {model.source} · Sketchfab (ochiq ta'lim litsenziyasi) · Internet kerak
          </p>
        </div>
      </div>
    </Screen>
  );
}
