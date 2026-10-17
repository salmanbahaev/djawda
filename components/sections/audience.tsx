import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";
import { courseDomId } from "@/lib/course-catalog";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
        <ol className="mt-10 border-t border-line">
          {home.audienceItems.map((item, index) => {
            const slug = item.courseSlug?.trim() ?? "";
            const courseTitle = titles.get(slug);
            const linked = Boolean(slug && courseTitle);
            const body = (
              <>
                <span>
                  <span className="text-xs font-semibold tracking-[0.18em] text-accent-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-muted">{item.text}</p>
                </span>
                {linked ? (
                  <span className="text-sm font-medium text-accent lg:text-right">
                    <span className="block">{courseTitle}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
                      {home.audienceLinkLabel}
                      <Arrow />
                    </span>
                  </span>
                ) : null}
              </>
            );
            const className =
              "grid gap-4 rounded-xl px-5 py-6 transition-colors duration-200 md:px-8 md:py-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:gap-10 lg:py-8";

            return (
              <li key={item.title} className="border-b border-line">
                <Reveal from="right" delay={index * 0.05}>
                  <div className="px-1 py-1.5 md:px-1.5 md:py-2">
                    {linked ? (
                      <a
                        href={`#${courseDomId(slug)}`}
                        className={`group ${className} hover:bg-[#fffdf8]`}
                      >
                        {body}
                      </a>
                    ) : (
                      <article className={className}>{body}</article>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
