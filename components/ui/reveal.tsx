"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={{ y: 28, scale: 0.985, filter: "blur(8px)" }}
      whileInView={{ y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
