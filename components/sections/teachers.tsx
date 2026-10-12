import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { AboutContent, HomeContent } from "@/lib/cms/content";
import { paragraphs } from "@/lib/cms/text";

export function TeachersSection({ home, about }: { home: HomeContent; about: AboutContent }) {
  return (
    <section id="teachers">
      <div data-surface="light" className="tone-light py-24 md:py-32">
        <Container>
          <Reveal from="left">
            <Eyebrow>{home.teachersEyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
              {home.teachersTitle}
            </h2>
            {home.teachersLead ? (
              <p className="mt-5 max-w-2xl text-muted">{home.teachersLead}</p>
            ) : null}
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {about.teachers.map((teacher, index) => (
              <Reveal key={teacher.name} from="right" delay={index * 0.08}>
                <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(23,23,26,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b0b0ab] sm:p-8">
                  <h3 className="text-2xl font-medium">{teacher.name}</h3>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
                    {teacher.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
      <div data-surface="light" className="tone-light surface-3 py-24 md:py-32">
        <Container>
          <Reveal from="left">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
              {about.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{about.lead}</p>
          </Reveal>
          <Reveal from="left">
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-muted">
              {paragraphs(about.story).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <h3 className="mt-12 text-2xl font-medium tracking-tight">{about.principlesTitle}</h3>
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {about.principles.map((item, index) => (
              <Reveal key={item.title} from="right" delay={index * 0.08}>
                <article className="h-full rounded-3xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(23,23,26,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b0b0ab]">
                  <h4 className="text-lg font-medium">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
