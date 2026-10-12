import type { WebThreadsProps } from "@/components/ui/backgrounds/web-threads";

/**
 * Hero threads. Values match the React Bits preview the owner picked.
 * color1, color3, and the remaining props stay at the component defaults.
 */
export const heroWebThreads = {
  glow: 0.007,
  spread: 0.13,
  fanMode: "left",
  speed: 0.15,
  color2: "#e49292",
  frequency: 4,
  brightness: 0.45,
  grainIntensity: 0.04,
} satisfies WebThreadsProps;
