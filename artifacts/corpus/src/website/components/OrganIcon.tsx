import type { ReactNode } from 'react';
import type { OrganId } from '../data/anatomy';

const paths: Record<OrganId, ReactNode> = {
  heart: <><path d="M10 8c-1-2-1-4 0-5M13 7V2m3 6 2-4M9 9C4 7 2 12 5 18c2 4 7 5 9 3 5-3 6-10 3-12-2-2-4 0-4 2-2-1-2-2-4-2Z" /><path d="m11 11-3 4 4 4 3-6m-6 2 6 1m-2-5 3-3" /></>,
  brain: <><path d="M12 5c-2-4-6-2-6 1-3 0-4 4-2 6-3 3 0 7 3 7 1 3 5 2 5-1V5Zm0 0c2-4 6-2 6 1 3 0 4 4 2 6 3 3 0 7-3 7-1 3-5 2-5-1" /><path d="M7 7c3 0 3 4 1 5m-3 1c3-1 5 2 4 4m8-10c-3 0-3 4-1 5m3 1c-3-1-5 2-4 4M8 3v3m8-3v3" /></>,
  lungs: <><path d="M10 8C8 5 6 6 4 10c-2 4-3 10 1 10 3 0 5-1 5-4V8Zm4 0c2-3 4-2 6 2 2 4 3 10-1 10-3 0-5-1-5-4V8ZM12 2v8m-4 3 4-3 4 3" /><path d="M10 7V4m4 3V4" /></>,
  liver: <><path d="M3 7c4-3 7-1 10 0 3 1 5-1 8 1 3 3-1 6-5 7-4 1-5-2-8 2-2 2-5 4-5 0V7Z" /><path d="M12 8c0 4-1 5-3 7m2-4c2 2 5 2 7 1" /></>,
  kidneys: <><path d="M8 4C4 2 2 7 2 12s3 8 6 6c3-2 2-5 0-6-2-1-2-2 0-3 2-1 2-4 0-5Zm8 0c4-2 6 3 6 8s-3 8-6 6c-3-2-2-5 0-6 2-1 2-2 0-3-2-1-2-4 0-5Z" /><path d="M8 12c4 0 3 6 3 10m5-10c-4 0-3 6-3 10" /></>,
  muscles: <><path d="m7 14 3-5-2-3 2-3 4 2-1 5 3 3c4-2 6 2 4 5-3 4-10 4-15 0-2-2-1-5 1-6l1 2Z" /><path d="M8 16c2-2 5-2 7 0m-5-7 3 1m2 6 2-3" /></>,
  skeleton: <><circle cx="12" cy="4" r="2.5" /><path d="M12 7v10m-6-6 6-3 6 3M7 14l5-3 5 3M8 9 5 15l-2 3m13-9 3 6 2 3M8 16l4 2 4-2m-7 2-3 4m9-4 3 4" /></>,
  nerves: <><path d="M13 2 10 7l3 3-3 4 2 4-3 4M10 7 6 5 3 7m10 3 5-3 3 1m-11 6-5-2-3 2m10 4 5-3 4 2M6 5l1-3m-2 10-1-3m14-2V4m-1 11 1 5" /><circle cx="13" cy="2" r="1" /><circle cx="9" cy="22" r="1" /></>,
};

export default function OrganIcon({ organ, size = 24, className = '' }: { organ: OrganId; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[organ]}</svg>;
}