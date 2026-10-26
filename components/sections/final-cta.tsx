import { Container, Eyebrow } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Reveal } from "@/components/ui/reveal";
import type { CourseContent, FormContent, HomeContent, SettingsContent } from "@/lib/cms/content";

export function FinalCtaSection({
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
      className="surface-paper section-y border-t border-[var(--color-line)]"
    >
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
        <Reveal>
          <Eyebrow index={10}>{home.finalEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">
            {home.finalTitle}
          </h2>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
            {home.finalText}
          </p>
        </Reveal>
        <Reveal>
          <LeadForm
            copy={{
              ...form,
              formats: form.formats.map((item) => ({ value: item.value, label: item.label })),
            }}
            courses={courses.map((course) => ({ slug: course.slug, title: course.title }))}
            whatsappUrl={settings.whatsappUrl || ""}
            phoneDisplay={settings.phoneDisplay}
            secondary={{ href: home.heroPrimaryHref, label: home.heroPrimaryLabel }}
          />
        </Reveal>
      </Container>
    </section>
  );
}
