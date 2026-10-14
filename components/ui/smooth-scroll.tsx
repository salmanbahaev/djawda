"use client";

import { useEffect } from "react";
import { followHash, installAnchorClicks, registerLenis } from "@/lib/anchor-scroll";

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
        anchors: false,
        lerp: 0.085,
      });
      registerLenis(
        (target, options) => {
          lenis.scrollTo(target, options);
        },
        { stop: () => lenis.stop(), start: () => lenis.start() },
      );
      const removeAnchorClicks = installAnchorClicks();
      lenis.on("scroll", ScrollTrigger.update);
      const onTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      const initial = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (initial && document.getElementById(initial)) followHash(initial, true);
      cleanup = () => {
        removeAnchorClicks();
        registerLenis(null);
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
