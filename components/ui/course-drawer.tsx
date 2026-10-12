"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { courseAccent } from "@/lib/course-accent";
import {
  courseDetailId,
  courseFacts,
  courseTabs,
  type CourseListItem,
  type CourseSection,
  type CourseTabId,
} from "@/lib/course-catalog";
import { paragraphs } from "@/lib/cms/text";
import { courseStatusLabel } from "@/lib/course-status";
import { lockPageScroll, unlockPageScroll } from "@/lib/anchor-scroll";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PANEL_EASE = [0.22, 1, 0.36, 1] as const;

function focusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    if (el.getAttribute("aria-hidden") === "true") return false;
    return el.getClientRects().length > 0;
  });
}

export function CourseStatusChip({ status }: { status: string }) {
  const open = status === "open";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-2.5 py-1 text-xs font-medium text-accent">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: open ? "var(--accent)" : "var(--accent-muted)" }}
      />
      {courseStatusLabel(status)}
    </span>
  );
}

function BulletIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="mt-1 h-4 w-4 shrink-0"
      fill="none"
      style={{ color }}
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M4.8 8.1 7 10.2 11.2 5.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionBlock({
  section,
  accent,
  image,
}: {
  section: CourseSection;
  accent: string;
  image?: { src: string; alt: string } | null;
}) {
  const body = paragraphs(section.body);
  return (
    <section className="rounded-2xl border border-[#eadfce] bg-white/80 px-5 py-5 sm:px-6">
      <h3 className="text-xl font-medium tracking-tight text-accent">{section.title}</h3>
      {body.map((paragraph) => (
        <p key={paragraph} className="mt-3 max-w-[65ch] leading-relaxed text-accent-muted">
          {paragraph}
        </p>
      ))}
      {section.items.length ? (
        <ul className="mt-4 space-y-2.5">
          {section.items.map((item) => (
            <li key={item} className="flex max-w-[65ch] gap-3 leading-relaxed text-accent">
              <BulletIcon color={accent} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.note ? (
        <p
          className="mt-4 max-w-[65ch] border-l-2 pl-4 text-sm leading-relaxed text-accent-muted"
          style={{ borderColor: accent }}
        >
          {section.note}
        </p>
      ) : null}
      {image ? (
        <figure className="mt-5">
          <Image
            src={image.src}
            alt={image.alt}
            width={1280}
            height={960}
            className="h-auto w-full rounded-2xl border border-[#eadfce]"
            sizes="(min-width: 768px) 600px, 100vw"
          />
        </figure>
      ) : null}
    </section>
  );
}

function DrawerFaq({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <div className="rounded-2xl border-2 border-accent/20 bg-[var(--paper-raised)] px-4 py-2 sm:px-5">
      <h3 className="px-1 pt-3 text-xl font-medium tracking-tight text-accent">
        Вопросы по этому курсу
      </h3>
      <div className="mt-1 divide-y divide-accent/10">
        {items.map((item, index) => {
          const expanded = open === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;
          return (
            <div key={item.question}>
              <h4>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-accent"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <span className="max-w-[65ch]">{item.question}</span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: PANEL_EASE }}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25 text-xl leading-none text-accent"
                  >
                    +
                  </motion.span>
                </button>
              </h4>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: PANEL_EASE }}
                    className="overflow-hidden"
                  >
                    {paragraphs(item.answer).map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[65ch] pb-4 leading-relaxed text-accent-muted first:pt-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseDrawerPanel({
  course,
  index,
  desktop,
  closeLabel,
  requestLabel,
  onClose,
  onRequest,
}: {
  course: CourseListItem;
  index: number;
  desktop: boolean;
  closeLabel: string;
  requestLabel: string;
  onClose: () => void;
  onRequest: () => void;
}) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const accent = courseAccent(course.accent, index);
  const tabs = useMemo(() => courseTabs(course), [course]);
  const facts = courseFacts(course);
  const [active, setActive] = useState<CourseTabId>(tabs[0]?.id ?? "audience");
  const [trackedSlug, setTrackedSlug] = useState(course.slug);
  if (trackedSlug !== course.slug) {
    setTrackedSlug(course.slug);
    setActive(tabs[0]?.id ?? "audience");
  }
  const showSubtitle = course.subtitle.trim() !== course.shortDescription.trim();
  const duration = reduce ? 0 : 0.28;

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    const portal = root.closest("[data-course-drawer-root]");
    const hidden: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child === portal) continue;
      if (child.tagName === "SCRIPT" || child.tagName === "LINK" || child.tagName === "STYLE") {
        continue;
      }
      if (child.hasAttribute("inert")) continue;
      child.setAttribute("inert", "");
      hidden.push(child);
    }
    root.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable(root);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey) {
        if (current === first || current === root || !root.contains(current)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      for (const el of hidden) el.removeAttribute("inert");
    };
  }, [course.slug, onClose]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const spacer = spacerRef.current;
    if (!scroller || !spacer) return;
    const apply = () => {
      spacer.style.height = `${scroller.clientHeight}px`;
    };
    apply();
    scroller.scrollTo({ top: 0 });
    const observer = new ResizeObserver(apply);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [course.slug]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const marker = scroller.getBoundingClientRect().top + 28;
      let next = tabs[0]?.id ?? "audience";
      for (const tab of tabs) {
        const el = document.getElementById(courseDetailId(course.slug, tab.id));
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) next = tab.id;
      }
      setActive((prev) => (prev === next ? prev : next));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [course.slug, tabs]);

  function scrollToTab(tab: CourseTabId) {
    const scroller = scrollerRef.current;
    const target = document.getElementById(courseDetailId(course.slug, tab));
    if (!scroller || !target) return;
    const top =
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    setActive(tab);
    scroller.scrollTo({ top: Math.max(0, top - 12), behavior: reduce ? "auto" : "smooth" });
  }

  const hiddenMotion = reduce ? { opacity: 0 } : desktop ? { x: "100%" } : { y: "100%" };
  const shownMotion = reduce ? { opacity: 1 } : { x: 0, y: 0 };

  return (
    <div data-course-drawer-root="" className="fixed inset-0 z-[60]">
      <motion.div
        className="absolute inset-0 bg-accent/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        id="course-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="course-drawer absolute flex h-dvh max-h-dvh flex-col bg-[var(--paper)] text-accent shadow-[0_0_0_1px_rgba(15,47,58,0.06),-24px_0_60px_rgba(15,47,58,0.2)] outline-none max-md:inset-x-0 max-md:bottom-0 md:inset-y-0 md:right-0 md:w-[680px] md:max-w-[720px]"
        initial={hiddenMotion}
        animate={shownMotion}
        exit={hiddenMotion}
        transition={{ duration, ease: PANEL_EASE }}
      >
        <header className="shrink-0 border-b border-[#e4d7c6] px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <CourseStatusChip status={course.status} />
              <h2 id={titleId} className="mt-3 text-3xl tracking-tight text-accent sm:text-4xl">
                {course.title}
              </h2>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/15 text-2xl leading-none text-accent"
              aria-label={closeLabel}
              onClick={onClose}
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </header>

        {tabs.length ? (
          <nav
            aria-label="Разделы курса"
            className="flex shrink-0 flex-wrap gap-1.5 border-b border-[#e4d7c6] px-5 py-3 sm:px-8"
          >
            {tabs.map((tab) => {
              const selected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
                    selected
                      ? "bg-accent text-[var(--paper)]"
                      : "text-accent-muted hover:bg-accent/5"
                  }`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => scrollToTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        ) : null}

        <div
          ref={scrollerRef}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8"
        >
          <div className="max-w-[65ch]">
            <p className="text-lg leading-relaxed text-accent">{course.shortDescription}</p>
            {showSubtitle ? (
              <p className="mt-3 leading-relaxed text-accent-muted">{course.subtitle}</p>
            ) : null}
            {facts.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {facts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-full border border-accent/10 bg-[var(--paper)] px-2.5 py-1 text-xs text-accent-muted"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            ) : null}
            {course.cardImage ? (
              <figure className="mt-5">
                <Image
                  src={course.cardImage}
                  alt={course.cardImageAlt || ""}
                  width={1280}
                  height={960}
                  className="h-auto w-full rounded-2xl border border-[#eadfce]"
                  sizes="(min-width: 768px) 600px, 100vw"
                />
              </figure>
            ) : null}
          </div>

          <div className="mt-8 space-y-5">
            {tabs.map((tab) => (
              <div key={tab.id} id={courseDetailId(course.slug, tab.id)} className="scroll-mt-4">
                {tab.id === "faq" ? (
                  <DrawerFaq items={course.faq} />
                ) : (
                  <div className="space-y-5">
                    <TabSections
                      course={course}
                      tabId={tab.id}
                      sections={tab.sections}
                      accent={accent.color}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={spacerRef} aria-hidden />
        </div>

        <footer className="shrink-0 border-t border-[#e4d7c6] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
          <button
            type="button"
            className="catalog-cta w-full rounded-full px-5 py-3.5 text-sm font-semibold"
            onClick={onRequest}
          >
            {requestLabel}
          </button>
        </footer>
      </motion.div>
    </div>
  );
}

function TabSections({
  course,
  tabId,
  sections,
  accent,
}: {
  course: CourseListItem;
  tabId: CourseTabId;
  sections: readonly CourseSection[];
  accent: string;
}) {
  const image =
    tabId === "materials" && course.materialsImage
      ? { src: course.materialsImage, alt: course.materialsImageAlt || "" }
      : null;
  const placedInSection = sections.some((section) => section.id === "materials");
  return (
    <>
      {sections.map((section) => (
        <SectionBlock
          key={`${section.id}-${section.title}`}
          section={section}
          accent={accent}
          image={section.id === "materials" ? image : null}
        />
      ))}
      {image && !placedInSection ? (
        <figure>
          <Image
            src={image.src}
            alt={image.alt}
            width={1280}
            height={960}
            className="h-auto w-full rounded-2xl border border-[#eadfce]"
            sizes="(min-width: 768px) 600px, 100vw"
          />
        </figure>
      ) : null}
    </>
  );
}

function subscribeToNothing() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export function CourseDrawer({
  course,
  index,
  desktop,
  closeLabel,
  requestLabel,
  onClose,
  onRequest,
  onClosed,
}: {
  course: CourseListItem | null;
  index: number;
  desktop: boolean;
  closeLabel: string;
  requestLabel: string;
  onClose: () => void;
  onRequest: () => void;
  onClosed: () => void;
}) {
  const isClient = useIsClient();
  const open = course !== null;

  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onClosed}>
      {course ? (
        <CourseDrawerPanel
          key="course-drawer"
          course={course}
          index={index}
          desktop={desktop}
          closeLabel={closeLabel}
          requestLabel={requestLabel}
          onClose={onClose}
          onRequest={onRequest}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
