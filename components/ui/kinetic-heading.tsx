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
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(105deg, #ffffff 0%, #ffffff 42%, #e6d3a4 50%, #ffffff 58%, #ffffff 100%)",
                  backgroundSize: "220% 100%",
                }}
                initial={{ backgroundPositionX: "0%" }}
                animate={reduce ? undefined : { backgroundPositionX: ["120%", "-30%"] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 3.8, repeat: Infinity, ease: "linear", delay: 1.1 }
                }
              >
                {word}
                {index < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
}
