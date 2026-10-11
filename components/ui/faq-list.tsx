"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

export function FaqList({
  items,
}: {
  items: readonly { question: string; answer: string; draft?: boolean }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-medium"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: expanded ? 45 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-xl leading-none text-gold"
                >
                  +
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-5 leading-relaxed text-muted">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
