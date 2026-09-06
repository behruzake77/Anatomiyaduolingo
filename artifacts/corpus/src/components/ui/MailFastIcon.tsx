"use client";

/**
 * "Mail Fast" animatsiyali ikonkasi (Lordicon wired-gradient #177).
 *
 * - `mode="hover"` (standart): statik `Send` ikonkasi, hover/focus paytida
 *   uchib ketayotgan konvert GIF'iga almashadi (ota-elementda `group` bo'lsa,
 *   butun tugma ustida ishlaydi).
 * - `mode="always"`: GIF doimiy aylanadi (masalan, "yuborildi" holati).
 *
 * GIF topilmasa yoki harakat o'chirilgan bo'lsa, statik ikonkaga tushadi.
 */
import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/utils/cn";
import "./MailFastIcon.css";

export const MAIL_FAST_GIF = "/img/stickers/mail-fast-hover-flying.gif";

export function MailFastIcon({
  size = 20,
  mode = "hover",
  className,
  alt = "",
}: {
  size?: number;
  mode?: "hover" | "always";
  className?: string;
  alt?: string;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <span
      className={cn("mail-fast", mode === "always" && "mail-fast--always", className)}
      style={{ width: size, height: size }}
    >
      <Send className="mail-fast__icon" size={size} strokeWidth={2} aria-hidden />
      {!broken && (
        <img
          src={MAIL_FAST_GIF}
          alt={alt}
          width={size}
          height={size}
          draggable={false}
          decoding="async"
          className="mail-fast__gif"
          onError={() => setBroken(true)}
        />
      )}
    </span>
  );
}
