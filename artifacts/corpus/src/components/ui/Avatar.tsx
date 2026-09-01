"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

export function Avatar({
  name,
  size = 48,
  src,
  className,
}: {
  name: string;
  size?: number;
  src?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-soft font-bold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={name}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials || "•"
      )}
    </div>
  );
}
