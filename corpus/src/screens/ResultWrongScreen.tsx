"use client";

import { motion } from "motion/react";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";

export function ResultWrongScreen() {
  const navigate = useAppStore((s) => s.navigate);

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

      <h1 className="text-3xl font-bold">Try Again</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted">
        The sternum (breastbone) sits at the centre of the chest and anchors the ribs — review the
        lesson and give it another go.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button size="lg" onClick={() => navigate("lesson")}>
          Retry
        </Button>
        <Button size="lg" variant="ghost" onClick={() => navigate("topics")}>
          Back to topics
        </Button>
      </div>
    </div>
  );
}
