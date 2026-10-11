"use client";

import { motion, useReducedMotion } from "motion/react";

export function KineticHeading({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="block">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom leading-[1.05]"
          >
            <motion.span
              className="kinetic-word inline-block"
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: reduce ? 0 : 0.85,
                delay: reduce ? 0 : 0.08 + index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
}
