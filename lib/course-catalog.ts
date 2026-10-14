export type CourseSection = {
  id: string | null;
  title: string;
  body: string | null;
  items: readonly string[];
  note: string | null;
};

export type CourseFaqItem = {
  question: string;
  answer: string;
  draft?: boolean;
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
  accent: string | null;
  cardImage: string | null;
  cardImageAlt: string | null;
  materialsImage: string | null;
  materialsImageAlt: string | null;
  sections: readonly CourseSection[];
  faq: readonly CourseFaqItem[];
};

export type CourseTabId = "audience" | "program" | "materials" | "format" | "faq";

export type CourseTab = {
  id: CourseTabId;
  label: string;
  sections: CourseSection[];
};

const TAB_DEFS: readonly { id: CourseTabId; label: string }[] = [
  { id: "audience", label: "Кому подойдёт" },
  { id: "program", label: "Программа" },
  { id: "materials", label: "Материалы" },
  { id: "format", label: "Расписание и цена" },
  { id: "faq", label: "Вопросы" },
];

export function courseDomId(slug: string) {
  return `course-${slug}`;
}

export function courseDetailId(slug: string, tab: CourseTabId) {
  return `course-detail-${slug}-${tab}`;
}

function bucketOf(section: CourseSection): Exclude<CourseTabId, "faq"> {
  if (section.id === "audience") return "audience";
  if (section.id === "materials") return "materials";
  if (section.id === "format") return "format";
  return "program";
}

/** Every CMS section lands in exactly one tab. Empty tabs stay hidden. */
export function courseTabs(course: CourseListItem): CourseTab[] {
  const grouped: Record<Exclude<CourseTabId, "faq">, CourseSection[]> = {
    audience: [],
    program: [],
    materials: [],
    format: [],
  };
  for (const section of course.sections) grouped[bucketOf(section)].push(section);

  const tabs: CourseTab[] = [];
  for (const def of TAB_DEFS) {
    if (def.id === "faq") {
      if (course.faq.length) tabs.push({ id: def.id, label: def.label, sections: [] });
      continue;
    }
    if (def.id === "materials") {
      if (grouped.materials.length || course.materialsImage) {
        tabs.push({ id: def.id, label: def.label, sections: grouped.materials });
      }
      continue;
    }
    if (grouped[def.id].length)
      tabs.push({ id: def.id, label: def.label, sections: grouped[def.id] });
  }
  return tabs;
}

export function courseFacts(course: CourseListItem) {
  return [course.formats, course.duration, course.groupSize].filter((part): part is string =>
    Boolean(part && part.trim()),
  );
}
