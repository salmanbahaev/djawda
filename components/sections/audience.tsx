import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";
import { courseDomId } from "@/lib/course-catalog";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AudienceSection({
  home,
  courses,
}: {
  home: HomeContent;
  courses: readonly { slug: string; title: string }[];
}) {
  const titles = new Map(courses.map((course) => [course.slug, course.title]));

  return (
    <section id="audience" data-surface="light" className="tone-light py-24 md:py-32">
      <Container>
        <Reveal from="left">
          <Eyebrow>{home.audienceEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
            {home.audienceTitle}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {home.audienceItems.map((item, index) => {
            const slug = item.courseSlug?.trim() ?? "";
            const courseTitle = titles.get(slug);
            const linked = Boolean(slug && courseTitle);
            const body = (
              <>
                <p className="text-xs font-semibold tracking-[0.18em] text-accent-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
                {linked ? (
                  <span className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm font-medium text-accent">
                    <span>{courseTitle}</span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
                      {home.audienceLinkLabel}
                      <Arrow />
                    </span>
                  </span>
                ) : null}
              </>
            );
            const className =
              "flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(23,23,26,0.04)] motion-reduce:transition-none";

            return (
              <Reveal key={item.title} from="right" delay={index * 0.06} className="h-full">
                {linked ? (
                  <a
                    href={`#${courseDomId(slug)}`}
                    className={`${className} transition duration-300 hover:-translate-y-1 hover:border-accent/40 motion-reduce:hover:translate-y-0`}
                  >
                    {body}
                  </a>
                ) : (
                  <article className={className}>{body}</article>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
