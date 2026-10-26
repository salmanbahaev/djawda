import { Container, Eyebrow } from "@/components/ui/container";
import { CourseList } from "@/components/ui/course-list";
import { Reveal } from "@/components/ui/reveal";
import type { CourseContent, HomeContent } from "@/lib/cms/content";

export function CoursesSection({ home, courses }: { home: HomeContent; courses: CourseContent[] }) {
  return (
    <section
      id="courses"
      data-surface="light"
      className="catalog-cream section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <Reveal>
          <Eyebrow index={3}>{home.catalogEyebrow}</Eyebrow>
          <h2 className="mt-4 text-4xl text-balance sm:text-5xl">{home.catalogTitle}</h2>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
            {home.catalogLead}
          </p>
        </Reveal>
        <CourseList
          courses={courses}
          linkLabel={home.courseLinkLabel}
          closeLabel={home.courseCloseLabel}
          requestLabel={home.courseRequestLabel}
        />
      </Container>
    </section>
  );
}
