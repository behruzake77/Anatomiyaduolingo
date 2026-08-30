"use client";

import {
  Bone,
  Activity,
  Apple,
  Wind,
  Brain,
  Heart,
  Droplet,
  Users,
  Layers,
  Target,
  TrendingUp,
  Trophy,
  Flame,
  Sparkles,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  bone: Bone,
  activity: Activity,
  apple: Apple,
  wind: Wind,
  brain: Brain,
  heart: Heart,
  droplet: Droplet,
  users: Users,
  layers: Layers,
  target: Target,
  "trending-up": TrendingUp,
  trophy: Trophy,
  flame: Flame,
  sparkles: Sparkles,
};

/** Resolve a data-driven icon name to a Lucide icon. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name] ?? Activity;
  return <Cmp aria-hidden {...props} />;
}
