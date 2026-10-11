"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { FaqList } from "@/components/ui/faq-list";
import { courseStatusLabel } from "@/lib/course-status";
import { paragraphs } from "@/lib/cms/text";
import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";

type Section = {
  id: string | null;
  title: string;
  body: string | null;
  items: readonly string[];
  note: string | null;
};

export type CourseListItem = {
  slug: string;
  title: string;
  shortDescription: string;
  subtitle: string;
  formats: string;
  duration: string;
  groupSize: string | null;
  priceText: string;
  status: string;
  materialsImage: string | null;
  materialsImageAlt: string | null;
  sections: readonly Section[];
  faq: readonly { question: string; answer: string; draft?: boolean }[];
};

function courseId(slug: string) {
  return `course-${slug}`;
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
  const reduce = useReducedMotion();
  const baseId = useId();

  useEffect(() => {
    function openFromHash(behavior: ScrollBehavior) {
      const id = window.location.hash.replace(/^#/, "");
      if (!id.startsWith("course-")) {
        setOpenSlug(null);
        return;
      }
      const slug = id.slice("course-".length);
      if (!courses.some((course) => course.slug === slug)) return;
      setOpenSlug(slug);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
      });
    }

    openFromHash("auto");
    const onChange = () => openFromHash(reduce ? "auto" : "smooth");
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, [courses, reduce]);

  function toggle(slug: string) {
    const next = openSlug === slug ? null : slug;
    setOpenSlug(next);
    const hash = next ? `#${courseId(slug)}` : "#courses";
    window.history.pushState(null, "", hash);
    if (next) {
      window.requestAnimationFrame(() => {
        document.getElementById(courseId(slug))?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-4">
      {courses.map((course) => {
        const expanded = openSlug === course.slug;
        const panelId = `${baseId}-${course.slug}-panel`;
        const buttonId = `${baseId}-${course.slug}-button`;
        const meta = [course.formats, course.duration, course.groupSize]
          .filter(Boolean)
          .join(" · ");
        const open = course.status === "open";

        return (
          <article
            key={course.slug}
            id={courseId(course.slug)}
            className="scroll-mt-24 overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-[0_24px_50px_-36px_rgba(0,61,82,0.55)]"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full flex-col gap-4 p-5 text-left sm:p-7"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(course.slug)}
              >
                <span className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                      open
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : "border-teal-900/15 bg-white text-teal-800"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${open ? "bg-gold" : "bg-teal-700"}`}
                    />
                    {courseStatusLabel(course.status)}
                  </span>
                  <span className="text-right text-base font-medium text-teal-900">
                    {course.priceText}
                  </span>
                </span>
                <span className="block text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                  {course.title}
                </span>
                <span className="block max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                  {course.shortDescription}
                </span>
                <span className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <span className="text-sm leading-relaxed text-teal-900">{meta}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-900">
                    {expanded ? closeLabel : linkLabel}
                    <motion.span
                      aria-hidden
                      animate={{ rotate: expanded ? 45 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.25 }}
                      className="inline-block text-lg leading-none text-gold"
                    >
                      +
                    </motion.span>
                  </span>
                </span>
              </button>
            </h3>

            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.28 },
                    }
              }
              className="overflow-hidden"
            >
              <div className="border-t border-line px-5 pt-6 pb-7 sm:px-7" inert={!expanded}>
                {course.subtitle && course.subtitle !== course.shortDescription ? (
                  <p className="max-w-3xl text-lg leading-relaxed">{course.subtitle}</p>
                ) : null}
                <div
                  className={
                    course.subtitle && course.subtitle !== course.shortDescription ? "mt-8" : ""
                  }
                >
                  {course.sections.map((section) => (
                    <section
                      key={`${section.id}-${section.title}`}
                      className="grid gap-3 border-b border-line py-6 last:border-b-0 md:grid-cols-[12rem_1fr] md:gap-8"
                    >
                      <h4 className="text-base font-medium tracking-tight md:pt-1">
                        {section.title}
                      </h4>
                      <div>
                        {paragraphs(section.body).map((paragraph) => (
                          <p key={paragraph} className="mt-3 leading-relaxed text-muted first:mt-0">
                            {paragraph}
                          </p>
                        ))}
                        {section.items.length ? (
                          <ul className="mt-3 space-y-2.5">
                            {section.items.map((item) => (
                              <li key={item} className="flex gap-3 leading-relaxed">
                                <span
                                  aria-hidden
                                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {section.note ? (
                          <p className="mt-4 border-l border-gold/70 pl-4 text-sm leading-relaxed text-muted">
                            {section.note}
                          </p>
                        ) : null}
                        {section.id === "materials" && course.materialsImage ? (
                          <figure className="mt-5">
                            <Image
                              src={course.materialsImage}
                              alt={course.materialsImageAlt || ""}
                              width={1280}
                              height={960}
                              className="h-auto w-full rounded-2xl border border-line"
                              sizes="(min-width: 768px) 640px, 100vw"
                            />
                          </figure>
                        ) : null}
                      </div>
                    </section>
                  ))}
                </div>

                {course.faq.length ? (
                  <div className="mt-4">
                    <h4 className="text-base font-medium tracking-tight">Вопросы по этому курсу</h4>
                    <div className="mt-2">
                      <FaqList items={course.faq} />
                    </div>
                  </div>
                ) : null}

                <a
                  href="#lead"
                  className="mt-6 inline-flex rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white"
                  onClick={() => {
                    document.dispatchEvent(
                      new CustomEvent(COURSE_SELECT_EVENT, { detail: course.slug }),
                    );
                  }}
                >
                  {requestLabel}
                </a>
              </div>
            </motion.div>
          </article>
        );
      })}
    </div>
  );
}
