import type { WebThreadsProps } from "@/components/ui/backgrounds/web-threads";

/**
 * Hero threads in slate and paper, over the ink field.
 * Component defaults are lilac and pink, so every color is set here.
 */
export const heroWebThreads = {
  glow: 0.007,
  spread: 0.13,
  fanMode: "left",
  speed: 0.15,
  color1: "#7f9aab",
  color2: "#f5efe4",
  color3: "#d7e4ea",
  frequency: 4,
  brightness: 0.55,
  grainIntensity: 0.04,
} satisfies WebThreadsProps;
