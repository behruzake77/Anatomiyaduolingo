"use client";

import { cn } from "@/utils/cn";

/**
 * Yengil 3D sticker. Optimallashtirilgan shaffof WebP assetlardan foydalanadi.
 * Faqat dekorsiya / vizual guide uchun — matn va tugmalarni yopmaydi.
 */
export function Sticker3D({
  src,
  size = 32,
  className,
  round = false,
}: {
  src: string;
  size?: number;
  className?: string;
  round?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        "select-none object-contain",
        !round && "drop-shadow-[0_3px_8px_rgba(108,92,231,0.16)]",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
