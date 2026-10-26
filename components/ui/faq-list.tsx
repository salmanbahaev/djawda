"use client";

import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";

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
  const baseId = useId();
  const active = groups[topicIndex] ?? groups[0];
  const showTabs = groups.length > 1;
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setVertical(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  function selectTopic(index: number) {
    setTopicIndex(index);
    setOpen(0);
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const max = groups.length - 1;
    let next = topicIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = topicIndex === max ? 0 : topicIndex + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = topicIndex === 0 ? max : topicIndex - 1;
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = max;
    else return;
    event.preventDefault();
    selectTopic(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  function onQuestionKey(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-faq-q]"),
    );
    const current = buttons.indexOf(target);
    if (current < 0) return;
    let next = current;
    if (event.key === "ArrowDown") next = current === buttons.length - 1 ? 0 : current + 1;
    else if (event.key === "ArrowUp") next = current === 0 ? buttons.length - 1 : current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next]?.focus();
  }

  if (!active) return null;

  return (
    <div
      className={showTabs ? "md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-x-12" : undefined}
    >
      {showTabs ? (
        <div
          role="tablist"
          aria-label="Темы вопросов"
          aria-orientation={vertical ? "vertical" : "horizontal"}
          className="flex gap-2 border-b border-[var(--color-line)] md:flex-col md:gap-2 md:border-r md:border-b-0 md:pr-6"
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
                className={`press min-h-11 cursor-pointer border-b-2 px-2 text-left text-base md:border-b-0 md:border-l-2 md:px-4 ${
                  selected
                    ? "border-[var(--accent)] font-semibold text-[var(--accent)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--accent)]"
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
        className={showTabs ? "pt-6 md:pt-0" : undefined}
        onKeyDown={onQuestionKey}
      >
        <div className="grid items-start gap-4 xl:grid-cols-2 xl:gap-6">
          {active.items.map((item, index) => {
            const expanded = open === index;
            const panelId = `${baseId}-answer-${topicIndex}-${index}`;
            const buttonId = `${baseId}-question-${topicIndex}-${index}`;
            return (
              <div
                key={item.question}
                className="rounded-2xl border border-[var(--color-line)] px-4"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    data-faq-q=""
                    className="press flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-lg font-medium"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 text-xl leading-none text-[var(--accent)] transition-transform duration-500 ease-brand motion-reduce:transition-none ${
                        expanded ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!expanded}
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-brand motion-reduce:transition-none ${
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-4 leading-relaxed text-[var(--color-muted)]">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
