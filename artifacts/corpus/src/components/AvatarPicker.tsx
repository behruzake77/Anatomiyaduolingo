"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Camera, Trash2, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useStrings } from "@/i18n";

const EMOJIS = ["🦴", "🧠", "🫀", "🫁", "👁️", "🦷", "💪", "👨‍⚕️", "👩‍⚕️", "🎓"];

const COLORS = ["#6C5CE7", "#00B894", "#FD79A8", "#0984E3", "#E17055", "#FDCB6E"];

/**
 * Internet avatarlar — DiceBear ochiq xizmatidan (har biri yagona URL).
 * Tanlanganda profil avatar sifatida shu URL saqlanadi.
 */
const DB = (style: string, seed: string) =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&radius=22`;

const WEB_AVATARS = [
  DB("thumbs", "corpus-1"),
  DB("thumbs", "corpus-2"),
  DB("thumbs", "corpus-3"),
  DB("fun-emoji", "anatomia-1"),
  DB("fun-emoji", "anatomia-2"),
  DB("fun-emoji", "anatomia-3"),
  DB("big-smile", "cell-1"),
  DB("big-smile", "cell-2"),
  DB("big-smile", "cell-3"),
  DB("pixel-art", "medic-1"),
  DB("pixel-art", "medic-2"),
  DB("pixel-art", "medic-3"),
  DB("squares", "nerve-1"),
  DB("squares", "nerve-2"),
  DB("squares", "nerve-3"),
  DB("adventurer", "student-1"),
  DB("adventurer", "student-2"),
  DB("adventurer", "student-3"),
  DB("joltavataars", "brain-1"),
  DB("joltavataars", "brain-2"),
  DB("joltavataars", "brain-3"),
  DB("notionists", "heart-1"),
  DB("notionists", "heart-2"),
  DB("notionists", "heart-3"),
  DB("micah", "lung-1"),
  DB("micah", "lung-2"),
  DB("micah", "lung-3"),
  DB("bottts", "bone-1"),
  DB("bottts", "bone-2"),
  DB("bottts", "bone-3"),
];

/** Rasmni kvadrat qilib 256×256 hajmgacha siqib data URL qaytaradi. */
async function fileToDataUrl(file: File): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      // markazdan kvadrat kesish (cover)
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function AvatarPicker({ onClose }: { onClose: () => void }) {
  const t = useStrings();
  const avatar = useAppStore((s) => s.avatar);
  const setAvatar = useAppStore((s) => s.setAvatar);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      setAvatar(url);
      onClose();
    } catch {
      /* no-op */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md rounded-t-3xl bg-surface p-5 pb-8 shadow-pop sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.avatarTitle}</h2>
          <button
            onClick={onClose}
            aria-label={t.zoomClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface2 text-muted"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* emoji variantlar */}
        <p className="mt-4 text-sm font-semibold text-muted">{t.avatarEmoji}</p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => {
                setAvatar(`emoji:${e}`);
                onClose();
              }}
              className="flex h-14 items-center justify-center rounded-2xl border border-line bg-white text-2xl transition active:scale-95"
            >
              {e}
            </button>
          ))}
        </div>

        {/* rang variantlar */}
        <p className="mt-4 text-sm font-semibold text-muted">{t.avatarColor}</p>
        <div className="mt-2 flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setAvatar(`color:${c}`);
                onClose();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition active:scale-95"
              style={{ background: c }}
            >
              ✓
            </button>
          ))}
        </div>

        {/* internet avatarlar */}
        <p className="mt-4 text-sm font-semibold text-muted">{t.avatarWeb}</p>
        <p className="text-[11px] text-muted/80">{t.avatarWebHint}</p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {WEB_AVATARS.map((url, i) => (
            <button
              key={i}
              onClick={() => {
                setAvatar(url);
                onClose();
              }}
              className="flex h-14 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white transition active:scale-95"
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </button>
          ))}
        </div>

        {/* rasm yuklash */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-soft active:scale-[.99] disabled:opacity-60"
        >
          <Camera className="h-5 w-5" aria-hidden /> {busy ? "…" : t.avatarUpload}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />

        {/* olib tashlash */}
        {avatar && (
          <button
            onClick={() => {
              setAvatar(null);
              onClose();
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-danger/10 py-3 text-sm font-semibold text-danger active:scale-[.99]"
          >
            <Trash2 className="h-5 w-5" aria-hidden /> {t.avatarRemove}
          </button>
        )}
      </motion.div>
    </div>
  );
}
