"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    void (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        autoRaf: false,
        anchors: { offset: 0 },
        lerp: 0.085,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const onTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      cleanup = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
