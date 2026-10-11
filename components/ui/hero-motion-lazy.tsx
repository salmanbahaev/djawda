"use client";

import dynamic from "next/dynamic";

export const HeroMotionPlayer = dynamic(
  () => import("@/components/ui/hero-motion-player").then((mod) => mod.HeroMotionPlayer),
  { ssr: false },
);
