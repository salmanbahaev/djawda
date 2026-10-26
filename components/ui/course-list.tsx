"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CourseDrawer, CourseStatusChip } from "@/components/ui/course-drawer";
import { Reveal } from "@/components/ui/reveal";
import { followHash } from "@/lib/anchor-scroll";
import { courseAccent } from "@/lib/course-accent";
import { courseDomId, courseFacts, type CourseListItem } from "@/lib/course-catalog";
import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";

export type { CourseListItem };

function withHistory(drawerSlug: string | null) {
  const current = window.history.state;
  const base: Record<string, unknown> =
    current && typeof current === "object" ? { ...(current as Record<string, unknown>) } : {};
  if (drawerSlug) base.courseDrawer = drawerSlug;
  else delete base.courseDrawer;
  return base;
}

function hashSlug() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}

export function CourseList({
  courses,
  linkLabel,
  closeLabel,
  requestLabel,
}: {
  courses: readonly CourseListItem[];
  linkLabel: string;
  closeLabel: string;
  requestLabel: string;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [desktop, setDesktop] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const afterClose = useRef<(() => void) | null>(null);

  const readSlug = useCallback(() => {
    const id = hashSlug();
    if (!id.startsWith("course-")) return null;
    const slug = id.slice("course-".length);
    return courses.some((course) => course.slug === slug) ? slug : null;
  }, [courses]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    function sync() {
      const slug = readSlug();
      if (slug && document.activeElement instanceof HTMLElement) {
        const active = document.activeElement;
        if (!active.closest("[data-course-drawer-root]")) openerRef.current = active;
      }
      setOpenSlug(slug);
    }
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [readSlug]);

  const openDrawer = useCallback((slug: string, source?: HTMLElement | null) => {
    if (source) openerRef.current = source;
    const hash = `#${courseDomId(slug)}`;
    if (window.location.hash !== hash) {
      window.history.pushState(withHistory(slug), "", hash);
    }
    setOpenSlug(slug);
  }, []);

  const closeDrawer = useCallback(() => {
    const id = hashSlug();
    if (id.startsWith("course-")) {
      const state = window.history.state as { courseDrawer?: string } | null;
      if (state?.courseDrawer) {
        window.history.back();
        return;
      }
      window.history.pushState(withHistory(null), "", "#courses");
    }
    setOpenSlug(null);
  }, []);

  const handleClosed = useCallback(() => {
    const node = openerRef.current;
    if (node && document.contains(node)) node.focus({ preventScroll: true });
    const run = afterClose.current;
    afterClose.current = null;
    run?.();
  }, []);

  const requestCourse = useCallback(
    (slug: string) => {
      document.dispatchEvent(new CustomEvent(COURSE_SELECT_EVENT, { detail: slug }));
      const go = () => {
        followHash("lead");
        window.setTimeout(() => {
          document.getElementById("lead-form-course")?.focus({ preventScroll: true });
        }, 60);
      };
      const id = hashSlug();
      if (openSlug === null) {
        if (id.startsWith("course-"))
          window.history.replaceState(withHistory(null), "", "#courses");
        go();
        return;
      }
      openerRef.current = null;
      afterClose.current = go;
      if (id.startsWith("course-")) window.history.replaceState(withHistory(null), "", "#courses");
      setOpenSlug(null);
    },
    [openSlug],
  );

  const activeIndex = courses.findIndex((course) => course.slug === openSlug);
  const active = activeIndex >= 0 ? courses[activeIndex] : null;

  return (
    <>
      <ul className="mt-12 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6">
        {courses.map((course, index) => {
          const accent = courseAccent(course.accent, index);
          const facts = courseFacts(course);
          const open = openSlug === course.slug;
          return (
            <li key={course.slug} className="min-w-0">
              <Reveal className="h-full" delay={index * 0.08}>
                <article
                  id={courseDomId(course.slug)}
                  className="course-card flex h-full flex-col overflow-hidden rounded-3xl border border-accent/10 bg-[var(--paper-raised)]"
                >
                  <span
                    aria-hidden
                    className="h-1 w-full"
                    style={{ backgroundColor: accent.color }}
                  />
                  <div className="flex h-full flex-col p-4 sm:p-6">
                    <CourseStatusChip status={course.status} />
                    <h3 className="mt-4 text-2xl font-medium tracking-tight text-balance text-accent">
                      {course.title}
                    </h3>
                    <p
                      className="mt-2 line-clamp-1 text-sm leading-relaxed text-accent-muted"
                      title={course.shortDescription}
                    >
                      {course.shortDescription}
                    </p>
                    {facts.length ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {facts.map((fact) => (
                          <li
                            key={fact}
                            className="rounded-full border border-accent/10 bg-[var(--paper)] px-3 py-1 text-xs leading-5 text-accent-muted"
                          >
                            {fact}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-auto pt-6">
                      <p className="text-xl font-medium tracking-tight text-accent">
                        {course.priceText}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="press min-h-11 rounded-full border border-accent/15 px-3 py-3 text-sm font-semibold text-accent hover:bg-accent/5"
                          aria-haspopup="dialog"
                          aria-expanded={open}
                          aria-controls={open ? "course-dialog" : undefined}
                          onClick={(event) => openDrawer(course.slug, event.currentTarget)}
                        >
                          {linkLabel}
                        </button>
                        <button
                          type="button"
                          className="catalog-cta press min-h-11 rounded-full px-3 py-3 text-sm font-semibold"
                          onClick={() => requestCourse(course.slug)}
                        >
                          Записаться
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <CourseDrawer
        course={active}
        index={Math.max(0, activeIndex)}
        desktop={desktop}
        closeLabel={closeLabel}
        requestLabel={requestLabel}
        onClose={closeDrawer}
        onRequest={() => {
          if (active) requestCourse(active.slug);
        }}
        onClosed={handleClosed}
      />
    </>
  );
}
