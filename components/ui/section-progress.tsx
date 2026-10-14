"use client";

import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Начало" },
  { id: "approach", label: "Подход" },
  { id: "audience", label: "Кому" },
  { id: "courses", label: "Курсы" },
  { id: "path", label: "Путь" },
  { id: "teachers", label: "Преподаватели" },
  { id: "formats", label: "Формат" },
  { id: "classroom", label: "Класс" },
  { id: "faq", label: "Вопросы" },
  { id: "contacts", label: "Контакты" },
] as const;

export function SectionProgress() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tone, setTone] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (pathname !== "/") return;

    let frame = 0;

    const measure = () => {
      const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
        (node): node is HTMLElement => Boolean(node),
      );
      if (nodes.length < 2) return;

      const anchor = window.scrollY + window.innerHeight * 0.42;
      const tops = nodes.map((node) => node.getBoundingClientRect().top + window.scrollY);
      let index = 0;
      for (let i = 0; i < tops.length; i += 1) {
        if (anchor >= tops[i] - 4) index = i;
      }
      const nextTop = tops[index + 1];
      const span = nextTop === undefined ? 0 : nextTop - tops[index];
      const local =
        nextTop === undefined || span <= 0
          ? 1
          : Math.min(1, Math.max(0, (anchor - tops[index]) / span));
      setActive(index);
      setProgress(index >= nodes.length - 1 ? 1 : (index + local) / (nodes.length - 1));

      const stack = document.elementsFromPoint(window.innerWidth - 6, window.innerHeight / 2);
      const surface = stack
        .map((node) => (node instanceof Element ? node.closest("[data-surface]") : null))
        .find((node): node is HTMLElement => node instanceof HTMLElement);
      setTone(surface?.dataset.surface === "light" ? "light" : "dark");
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    frame = requestAnimationFrame(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  const light = tone === "light";

  return (
    <nav
      aria-label="Разделы страницы"
      data-tone={tone}
      className="section-rail fixed top-1/2 right-[max(2px,env(safe-area-inset-right))] z-30 -translate-y-1/2 max-[340px]:hidden"
    >
      <div className="relative h-[min(17.25rem,52vh)] w-3.5">
        <span
          aria-hidden
          className={`absolute top-1.5 bottom-1.5 left-1/2 w-px -translate-x-1/2 ${
            light ? "bg-[#17171a]/20 shadow-[0_0_0_1px_rgba(255,255,255,0.65)]" : "bg-white/25"
          }`}
        />
        <span
          aria-hidden
          className={`absolute top-1.5 left-1/2 w-px origin-top -translate-x-1/2 ${
            light ? "bg-[#17171a]/65" : "bg-white/70"
          } ${reduce ? "" : "transition-[height] duration-200 ease-out"}`}
          style={{ height: `calc((100% - 0.75rem) * ${progress})` }}
        />
        <ol className="relative flex h-full flex-col justify-between">
          {SECTIONS.map((section, index) => {
            const reached = index <= active;
            const current = index === active;
            return (
              <li key={section.id} className="flex justify-center">
                <a
                  href={`#${section.id}`}
                  aria-label={section.label}
                  aria-current={current ? "true" : undefined}
                  className="group relative flex h-3.5 w-3.5 items-center justify-center"
                >
                  <span
                    aria-hidden
                    className={`block rounded-full ${reduce ? "" : "transition-[width,height,background-color,box-shadow] duration-200"} ${dotClass(light, reached, current)}`}
                  />
                  <span
                    className={`rail-tip pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                      light ? "bg-[#17171a] text-[#f5f5f4]" : "bg-[#f4f4f5] text-[#17171a]"
                    }`}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function dotClass(light: boolean, reached: boolean, current: boolean) {
  if (current) {
    return light
      ? "h-2 w-2 bg-[#17171a] shadow-[0_0_0_3px_rgba(23,23,26,0.14),0_0_0_1px_rgba(255,255,255,0.9)]"
      : "h-2 w-2 bg-[#f4f4f5] shadow-[0_0_0_3px_rgba(255,255,255,0.18),0_0_0_1px_rgba(0,0,0,0.4)]";
  }
  if (reached) {
    return light
      ? "h-1.5 w-1.5 bg-[#17171a]/70 shadow-[0_0_0_1px_rgba(255,255,255,0.85)]"
      : "h-1.5 w-1.5 bg-white/75 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]";
  }
  return light
    ? "h-1.5 w-1.5 bg-transparent shadow-[inset_0_0_0_1px_rgba(23,23,26,0.4),0_0_0_1px_rgba(255,255,255,0.8)]"
    : "h-1.5 w-1.5 bg-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_0_0_1px_rgba(0,0,0,0.35)]";
}
