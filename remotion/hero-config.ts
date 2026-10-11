/** Timings and brand colors for the hero motion composition. 30fps, 8s loop. */
export const heroMotion = {
  fps: 30,
  durationInFrames: 240,
  width: 1600,
  height: 900,
  colors: {
    silver: "#e7ebef",
    gold: "#e6d3a4",
    teal: "#0c5168",
  },
} as const;

export type HeroDensity = "full" | "lite";
