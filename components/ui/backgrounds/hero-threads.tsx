"use client";

import dynamic from "next/dynamic";
import { heroWebThreads } from "@/components/ui/backgrounds/web-threads-config";

const WebThreads = dynamic(() => import("@/components/ui/backgrounds/web-threads"), {
  ssr: false,
});

export function HeroThreads() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[var(--ink)]" aria-hidden>
      <WebThreads {...heroWebThreads} className="absolute inset-0" />
    </div>
  );
}
