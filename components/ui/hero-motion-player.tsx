"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroMotion } from "@/remotion/hero-motion";
import { heroMotion, type HeroDensity } from "@/remotion/hero-config";

export function HeroMotionPlayer() {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const [density] = useState<HeroDensity>(() =>
    window.matchMedia("(max-width: 767px)").matches ? "lite" : "full",
  );

  useEffect(() => {
    const node = host.current;
    if (!node || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void player.current?.play();
        else player.current?.pause();
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  if (reduce) return null;

  return (
    <div ref={host} className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <Player
        ref={player}
        component={HeroMotion}
        inputProps={{ density }}
        durationInFrames={heroMotion.durationInFrames}
        compositionWidth={heroMotion.frames[density].width}
        compositionHeight={heroMotion.frames[density].height}
        fps={heroMotion.fps}
        loop
        autoPlay
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      />
    </div>
  );
}
