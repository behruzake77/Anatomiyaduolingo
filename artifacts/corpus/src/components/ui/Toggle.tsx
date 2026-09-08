"use client";

import { cn } from "@/utils/cn";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("ui-toggle", checked && "ui-toggle--checked")}
    >
      <span className="ui-toggle__button" aria-hidden="true">
        <span className="ui-toggle__thumb" />
        <span className="ui-toggle__indicator" />
      </span>
    </button>
  );
}
