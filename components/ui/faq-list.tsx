"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";

type FaqItem = { question: string; answer: string; draft?: boolean; topic?: string | null };

function groupItems(items: readonly FaqItem[]) {
  const order: string[] = [];
  const map = new Map<string, FaqItem[]>();
  for (const item of items) {
    const topic = item.topic?.trim() || "Общее";
    const list = map.get(topic);
    if (list) list.push(item);
    else {
      order.push(topic);
      map.set(topic, [item]);
    }
  }
  return order.map((topic) => ({ topic, items: map.get(topic) ?? [] }));
}

export function FaqList({ items }: { items: readonly FaqItem[] }) {
  const groups = useMemo(() => groupItems(items), [items]);
  const [topicIndex, setTopicIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const active = groups[topicIndex] ?? groups[0];
  const showTabs = groups.length > 1;

  function selectTopic(index: number) {
    setTopicIndex(index);
    setOpen(0);
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const max = groups.length - 1;
    let next = topicIndex;
    if (event.key === "ArrowRight") next = topicIndex === max ? 0 : topicIndex + 1;
    else if (event.key === "ArrowLeft") next = topicIndex === 0 ? max : topicIndex - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = max;
    else return;
    event.preventDefault();
    selectTopic(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  if (!active) return null;

  return (
    <div>
      {showTabs ? (
        <div
          role="tablist"
          aria-label="Темы вопросов"
          className="flex flex-wrap gap-2"
          onKeyDown={onTabKey}
        >
          {groups.map((group, index) => {
            const selected = index === topicIndex;
            return (
              <button
                key={group.topic}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selected
                    ? "bg-accent text-[var(--paper)]"
                    : "border border-line bg-white text-accent hover:border-accent/40"
                }`}
                onClick={() => selectTopic(index)}
              >
                {group.topic}
              </button>
            );
          })}
        </div>
      ) : null}
      <div
        id={`${baseId}-panel`}
        role={showTabs ? "tabpanel" : undefined}
        aria-labelledby={showTabs ? `${baseId}-tab-${topicIndex}` : undefined}
        className={showTabs ? "mt-4" : undefined}
      >
        <div className="divide-y divide-line border-y border-line">
          {active.items.map((item, index) => {
            const expanded = open === index;
            const panelId = `${baseId}-answer-${topicIndex}-${index}`;
            const buttonId = `${baseId}-question-${topicIndex}-${index}`;
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
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 text-xl leading-none text-accent"
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
                      transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
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
      </div>
    </div>
  );
}
