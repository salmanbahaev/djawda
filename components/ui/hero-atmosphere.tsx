"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect } from "react";

export function HeroAtmosphere() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointerX = useMotionValue(-999);
  const pointerY = useMotionValue(-999);
  const springX = useSpring(x, { stiffness: 70, damping: 22, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 70, damping: 22, mass: 0.7 });
  const blobX = useSpring(pointerX, { stiffness: 120, damping: 26, mass: 0.4 });
  const blobY = useSpring(pointerY, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const onMove = (event: PointerEvent) => {
      x.set((event.clientX / window.innerWidth - 0.5) * 42);
      y.set((event.clientY / window.innerHeight - 0.5) * 28);
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY, x, y]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      <motion.div
        className="absolute top-[8%] left-[6%] h-40 w-40 rounded-full border border-silver/30 sm:h-56 sm:w-56"
        style={{ x: springX, y: springY }}
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[6%] bottom-[12%] h-28 w-28 rounded-full border border-gold-2/30 sm:h-40 sm:w-40"
        animate={{ y: [0, -18, 0], rotate: [-8, 8, -8] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute hidden h-72 w-72 rounded-full sm:block"
        style={{
          x: blobX,
          y: blobY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(230,211,164,0.34) 0%, rgba(231,235,239,0.14) 34%, transparent 70%)",
        }}
      />
    </div>
  );
}
