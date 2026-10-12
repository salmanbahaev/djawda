"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const WIDTH = 2880;
const MID = 40;

function wavePath(period: number, amplitude: number) {
  let d = `M 0 ${MID}`;
  for (let x = 0; x < WIDTH; x += period) {
    const half = period / 2;
    const peak = x + half;
    const end = x + period;
    d += ` C ${x + half * 0.25} ${MID - amplitude}, ${x + half * 0.75} ${MID - amplitude}, ${peak} ${MID}`;
    d += ` C ${peak + half * 0.25} ${MID + amplitude}, ${peak + half * 0.75} ${MID + amplitude}, ${end} ${MID}`;
  }
  return d;
}

const WAVES = [
  {
    period: 720,
    amp: 16,
    opacity: 0.18,
    tone: "silver",
    top: "12%",
    shift: "18s",
    bob: "16s",
    bobPx: "10px",
    reverse: false,
    extra: false,
  },
  {
    period: 480,
    amp: 12,
    opacity: 0.36,
    tone: "blue",
    top: "27%",
    shift: "14s",
    bob: "13s",
    bobPx: "8px",
    reverse: true,
    extra: false,
  },
  {
    period: 720,
    amp: 22,
    opacity: 0.24,
    tone: "silver",
    top: "43%",
    shift: "20s",
    bob: "18s",
    bobPx: "14px",
    reverse: false,
    extra: false,
  },
  {
    period: 480,
    amp: 18,
    opacity: 0.3,
    tone: "blue",
    top: "58%",
    shift: "16s",
    bob: "11s",
    bobPx: "12px",
    reverse: true,
    extra: false,
  },
  {
    period: 720,
    amp: 14,
    opacity: 0.16,
    tone: "silver",
    top: "73%",
    shift: "12s",
    bob: "15s",
    bobPx: "9px",
    reverse: false,
    extra: true,
  },
  {
    period: 480,
    amp: 20,
    opacity: 0.28,
    tone: "blue",
    top: "86%",
    shift: "17s",
    bob: "19s",
    bobPx: "11px",
    reverse: true,
    extra: true,
  },
] as const;

export function HeroWaves() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    let onScreen = false;
    let tabVisible = document.visibilityState !== "hidden";
    const sync = () => root.classList.toggle("is-playing", onScreen && tabVisible);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      sync();
    });
    observer.observe(root);
    const onVisibility = () => {
      tabVisible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.classList.remove("is-playing");
    };
  }, [reduce]);

  return (
    <div ref={rootRef} className="hero-waves pointer-events-none absolute inset-0" aria-hidden>
      {WAVES.map((wave) => (
        <div
          key={`${wave.top}-${wave.period}`}
          className={`hero-wave-bob absolute right-0 left-0 h-20 ${wave.extra ? "hero-wave-extra" : ""}`}
          style={{
            top: wave.top,
            ["--bob" as string]: wave.bobPx,
            ["--bob-duration" as string]: wave.bob,
          }}
        >
          <div
            className={`hero-wave-shift ${wave.reverse ? "is-reverse" : ""}`}
            style={{ ["--shift-duration" as string]: wave.shift }}
          >
            <svg
              className="block h-full w-full"
              viewBox={`0 0 ${WIDTH} 80`}
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d={wavePath(wave.period, wave.amp)}
                stroke={wave.tone === "blue" ? "var(--accent-faint)" : "var(--color-silver)"}
                strokeWidth={wave.tone === "blue" ? 1.35 : 1.15}
                strokeOpacity={wave.opacity}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
