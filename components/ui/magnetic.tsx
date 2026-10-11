"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 16, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 170, damping: 16, mass: 0.35 });

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.32);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
