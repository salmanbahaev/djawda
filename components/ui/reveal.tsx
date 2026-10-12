"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const DISTANCE = 32;

export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "left",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const x = from === "left" ? -DISTANCE : DISTANCE;

  return (
    <motion.div
      className={`reveal ${className}`}
      initial={reduce ? false : { opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
