import { Container, Eyebrow } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import type { CourseContent, FormContent, HomeContent, SettingsContent } from "@/lib/cms/content";

export function LeadSection({
  home,
  settings,
  form,
  courses,
}: {
  home: HomeContent;
  settings: SettingsContent;
  form: FormContent;
  courses: CourseContent[];
}) {
  return (
    <section
      id="lead"
      data-surface="light"
      className="tone-light surface-3 relative scroll-mt-20 py-24 md:py-32"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <Eyebrow>{home.finalEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
            {home.finalTitle}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{home.finalText}</p>
        </div>
        <LeadForm
          copy={{
            ...form,
            formats: form.formats.map((item) => ({ value: item.value, label: item.label })),
          }}
          courses={courses.map((course) => ({ slug: course.slug, title: course.title }))}
          whatsappUrl={settings.whatsappUrl || ""}
        />
      </Container>
    </section>
  );
}
