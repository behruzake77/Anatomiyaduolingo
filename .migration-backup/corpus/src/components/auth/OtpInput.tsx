"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

/**
 * 6 xonali OTP — raqamli klaviatura, paste, one-time-code autofill.
 */
export function OtpInput({ value, onChange, disabled, error }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.replace(/\D/g, "").slice(0, LENGTH);

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];
    el?.focus();
    el?.select();
  };

  const apply = (next: string, focusIndex?: number) => {
    const cleaned = next.replace(/\D/g, "").slice(0, LENGTH);
    onChange(cleaned);
    if (typeof focusIndex === "number") {
      requestAnimationFrame(() => focusAt(focusIndex));
    }
  };

  const onBoxChange = (index: number, raw: string) => {
    const only = raw.replace(/\D/g, "");
    if (!only) {
      const next = digits.split("");
      next[index] = "";
      apply(next.join(""), index);
      return;
    }
    // Autofill / bir nechta belgi bitta katakga tushganda.
    if (only.length > 1) {
      apply(only, Math.min(only.length, LENGTH - 1));
      return;
    }
    const next = digits.split("");
    while (next.length < LENGTH) next.push("");
    next[index] = only;
    apply(next.join(""), index + 1);
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const next = digits.split("");
        next[index] = "";
        apply(next.join(""), index);
      } else {
        const next = digits.split("");
        if (index > 0) next[index - 1] = "";
        apply(next.join(""), index - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    apply(text, LENGTH - 1);
  };

  return (
    <div className="flex justify-center gap-2" role="group" aria-label="Tasdiqlash kodi">
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoFocus={i === 0}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={LENGTH}
          disabled={disabled}
          value={digits[i] ?? ""}
          onChange={(e) => onBoxChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          aria-label={`${i + 1}-raqam`}
          className={
            "h-14 w-11 rounded-2xl border bg-surface text-center text-xl font-bold tabular-nums outline-none transition " +
            "focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-50 " +
            (error ? "border-danger text-danger" : "border-line text-ink")
          }
        />
      ))}
    </div>
  );
}
