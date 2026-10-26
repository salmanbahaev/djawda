"use client";

import { Container } from "@/components/ui/container";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

function linesFrom(text: string) {
  const colon = text.indexOf(":");
  if (colon === -1) return [text.trim()].filter(Boolean);
  const first = text.slice(0, colon + 1).trim();
  const second = text.slice(colon + 1).trim();
  return [first, second].filter(Boolean);
}

export function Statement({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const lines = linesFrom(text);
  const rows = lines.reduce<{ word: string; index: number }[][]>((groups, line) => {
    const start = groups.reduce((count, group) => count + group.length, 0);
    const lineWords = line
      .split(/\s+/)
      .filter(Boolean)
      .map((word, offset) => ({ word, index: start + offset }));
    groups.push(lineWords);
    return groups;
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduce) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    if (nodes.length === 0) return;

    let frame = 0;
    let shown = 0;
    let watching = false;

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const end = window.innerHeight * 0.36;
      const progress = (start - rect.top) / Math.max(1, start - end);
      const next = Math.max(shown, Math.ceil(Math.min(1, Math.max(0, progress)) * nodes.length));
      shown = next;
      nodes.forEach((node, index) => {
        if (index < next) node.classList.add("is-on");
      });
      if (shown >= nodes.length) {
        watching = false;
        return;
      }
      if (watching) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible || shown >= nodes.length) {
          watching = false;
          window.cancelAnimationFrame(frame);
          return;
        }
        if (watching) return;
        watching = true;
        frame = window.requestAnimationFrame(update);
      },
      { rootMargin: "15% 0px", threshold: 0 },
    );

    observer.observe(root);
    return () => {
      watching = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduce, text]);

  return (
    <section ref={ref} data-surface="dark" className="surface-dark section-y">
      <Container>
        <p className="max-w-[680px] font-display text-4xl leading-tight text-balance md:text-6xl">
          {rows.map((lineWords) => (
            <span key={lineWords.map((item) => item.index).join("-")} className="block">
              {lineWords.map((item) => (
                <span
                  key={item.index}
                  data-word
                  className={reduce ? "statement-word is-on" : "statement-word"}
                >
                  {item.word}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
