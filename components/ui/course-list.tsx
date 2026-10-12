"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { CountUp } from "@/components/ui/count-up";
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

function StatusBadge({ status }: { status: string }) {
  const open = status === "open";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
        open
          ? "border-white/30 bg-white/10 text-[#f4f4f5]"
          : "border-line bg-[#141416] text-[#c8c8ce]"
      }`}
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <motion.span
          className={`status-ping absolute inline-flex h-full w-full rounded-full ${open ? "bg-[#d6d6db]" : "bg-[#8e8e94]"}`}
          animate={{ scale: [1, 1.85], opacity: [0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <span
          className={`relative h-2 w-2 rounded-full ${open ? "bg-[#d6d6db]" : "bg-[#8e8e94]"}`}
        />
      </span>
      {courseStatusLabel(status)}
    </span>
  );
}

function CourseCard({
  course,
  expanded,
  panelId,
  buttonId,
  linkLabel,
  closeLabel,
  requestLabel,
  onToggle,
}: {
  course: CourseListItem;
  expanded: boolean;
  panelId: string;
  buttonId: string;
  linkLabel: string;
  closeLabel: string;
  requestLabel: string;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const [glare, setGlare] = useState(false);
  const meta = [course.formats, course.duration, course.groupSize].filter((part): part is string =>
    Boolean(part),
  );

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
    setGlare(false);
  }

  useEffect(() => {
    if (!expanded) return;
    rotateX.set(0);
    rotateY.set(0);
  }, [expanded, rotateX, rotateY]);

  function onMove(event: React.PointerEvent<HTMLElement>) {
    if (reduce || expanded || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--gx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--gy", `${py * 100}%`);
    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 6);
    if (!glare) setGlare(true);
  }

  return (
    <div className="[perspective:1100px]">
      <motion.article
        id={courseId(course.slug)}
        className="course-card relative scroll-mt-24 overflow-hidden rounded-3xl border border-line bg-[#18181a] [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        onPointerMove={onMove}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
      >
        <span
          aria-hidden
          className={`course-glare pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            glare && !expanded ? "opacity-100" : "opacity-0"
          }`}
        />
        <h3 className="relative">
          <button
            id={buttonId}
            type="button"
            className="flex w-full cursor-pointer flex-col gap-4 p-5 text-left sm:p-7"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => {
              resetTilt();
              onToggle();
            }}
          >
            <span className="flex items-start justify-between gap-3">
              <StatusBadge status={course.status} />
              <CountUp
                text={course.priceText}
                className="text-right text-base font-medium text-[#f4f4f5]"
              />
            </span>
            <span className="block text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {course.title}
            </span>
            <span className="block max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {course.shortDescription}
            </span>
            <span className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <span className="text-sm leading-relaxed text-[#d6d6db]">
                {meta.map((part, index) => (
                  <span key={`${part}-${index}`}>
                    {index > 0 ? " · " : null}
                    {part === course.duration ? <CountUp text={part} /> : part}
                  </span>
                ))}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#f4f4f5]">
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
                  height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.3 },
                }
          }
          className="relative overflow-hidden"
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
                  <h4 className="text-base font-medium tracking-tight md:pt-1">{section.title}</h4>
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
              className="mt-6 inline-flex rounded-full bg-[#f4f4f5] px-5 py-3 text-sm font-medium text-[#141416] transition duration-200 hover:bg-white"
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
      </motion.article>
    </div>
  );
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
      {courses.map((course) => (
        <CourseCard
          key={course.slug}
          course={course}
          expanded={openSlug === course.slug}
          panelId={`${baseId}-${course.slug}-panel`}
          buttonId={`${baseId}-${course.slug}-button`}
          linkLabel={linkLabel}
          closeLabel={closeLabel}
          requestLabel={requestLabel}
          onToggle={() => toggle(course.slug)}
        />
      ))}
    </div>
  );
}
