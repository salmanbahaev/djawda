/** Timings and brand colors for the hero motion composition. 30fps, 8s loop. */
export const heroMotion = {
  fps: 30,
  durationInFrames: 240,
  frames: {
    full: { width: 1440, height: 860 },
    lite: { width: 390, height: 780 },
  },
  colors: {
    silver: "#f4f7f8",
    gold: "#e6d3a4",
  },
} as const;

export type HeroDensity = "full" | "lite";
