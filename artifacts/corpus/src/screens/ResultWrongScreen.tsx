"use client";

import { motion } from "motion/react";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { ReactionSticker } from "@/components/ReactionSticker";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

export function ResultWrongScreen() {
  const navigate = useAppStore((s) => s.navigate);
  const resetTo = useAppStore((s) => s.resetTo);
  const t = useStrings();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-28 w-28 items-center justify-center rounded-full bg-danger/10 text-danger"
      >
        <Frown className="h-14 w-14" aria-hidden />
      </motion.div>
      <ReactionSticker ok={false} seed="result-wrong" size="sm" label="" />

      <h1 className="text-3xl font-bold">{t.tryAgain}</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted">
        Sternum (to&apos;sh suyagi) ko&apos;krakning markazida joylashib, qovurg&apos;alarni biriktiradi —
        darsni qayta ko&apos;rib, yana urinib ko&apos;ring.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button size="lg" onClick={() => resetTo("lesson", ["lessons"])}>
          {t.retry}
        </Button>
        <GoBackButton onClick={() => resetTo("topics")} label={t.backToTopics} />
      </div>
    </div>
  );
}
