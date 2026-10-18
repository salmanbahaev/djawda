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
          <ol className="mt-14 max-w-3xl">
            {about.teachers.map((teacher, teacherIndex) => {
              const lastTeacher = teacherIndex === about.teachers.length - 1;
              return (
                <li key={teacher.name}>
                  <Reveal from="right" delay={teacherIndex * 0.06}>
                    <h3 className="relative pb-6 pl-10 text-2xl font-medium tracking-tight">
                      <span
                        aria-hidden
                        className="absolute top-2.5 left-0 z-10 h-3.5 w-3.5 rounded-full border border-accent bg-accent"
                      />
                      {teacher.lines.length > 0 || !lastTeacher ? (
                        <span
                          aria-hidden
                          className={`absolute bottom-0 left-[6.5px] w-px bg-accent/25 ${
                            teacherIndex === 0 ? "top-5" : "top-0"
                          }`}
                        />
                      ) : null}
                      {teacher.name}
                    </h3>
                    <ol>
                      {teacher.lines.map((line, lineIndex) => {
                        const lastLine = lineIndex === teacher.lines.length - 1;
                        const terminal = lastTeacher && lastLine;
                        return (
                          <li
                            key={line}
                            className={`relative pl-10 ${terminal ? "" : lastLine ? "pb-14" : "pb-7"}`}
                          >
                            {terminal ? null : (
                              <span
                                aria-hidden
                                className="absolute top-0 bottom-0 left-[6.5px] w-px bg-accent/25"
                              />
                            )}
                            <span
                              aria-hidden
                              className="absolute top-1.5 left-[3px] z-10 h-2 w-2 rounded-full bg-[#f5f5f4] ring-1 ring-accent"
                            />
                            <p className="text-sm leading-relaxed text-muted">{line}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </Reveal>
                </li>
              );
            })}
          </ol>
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
          <div className="mt-8 border-t border-line md:grid md:grid-cols-3">
            {about.principles.map((item, index) => (
              <Reveal key={item.title} from="right" delay={index * 0.06}>
                <article className="border-b border-line py-6 md:border-b-0 md:border-l md:px-8 md:py-2 md:first:border-l-0 md:first:pl-0">
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
