"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

function parseAmount(text: string) {
  const matches = [...text.matchAll(/\d[\d\s]*/g)];
  if (matches.length !== 1) return null;
  const match = matches[0];
  if (match.index === undefined) return null;
  const token = match[0].trimEnd();
  const digits = token.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return null;
  return {
    value: Number(digits),
    prefix: text.slice(0, match.index),
    suffix: text.slice(match.index + token.length),
  };
}

function formatRu(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value).replace(/[\u00a0\u202f]/g, " ");
}

export function CountUp({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parseAmount(text), [text]);
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (reduce !== false || !parsed) return;
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1100);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(parsed.value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [parsed, reduce]);

  const shown =
    parsed && value !== null && value !== parsed.value
      ? `${parsed.prefix}${formatRu(value)}${parsed.suffix}`
      : text;

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
