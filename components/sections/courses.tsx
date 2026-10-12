import { Container, Eyebrow } from "@/components/ui/container";
import { CourseList } from "@/components/ui/course-list";
import type { CourseContent, HomeContent } from "@/lib/cms/content";

export function CoursesSection({ home, courses }: { home: HomeContent; courses: CourseContent[] }) {
  return (
    <section id="courses" data-surface="dark" className="scroll-mt-20 bg-[#0f0f10] py-24 md:py-32">
      <Container>
        <Eyebrow>{home.catalogEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          {home.catalogTitle}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{home.catalogLead}</p>
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
