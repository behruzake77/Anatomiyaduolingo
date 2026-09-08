"use client";

export function PatternBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pattern-background ${className}`} />
  );
}
