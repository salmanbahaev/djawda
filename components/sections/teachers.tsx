import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { AboutContent, HomeContent } from "@/lib/cms/content";
import { paragraphs } from "@/lib/cms/text";

export function TeachersSection({ home, about }: { home: HomeContent; about: AboutContent }) {
  return (
    <section id="teachers">
      <div
        data-surface="light"
        className="surface-paper section-y border-t border-[var(--color-line)]"
      >
        <Container>
          <Reveal>
            <Eyebrow index={5}>{home.teachersEyebrow}</Eyebrow>
            <h2 className="mt-4 text-4xl text-balance sm:text-5xl">{home.teachersTitle}</h2>
            {home.teachersLead ? (
              <p className="mt-6 max-w-[680px] text-pretty text-[var(--color-muted)]">
                {home.teachersLead}
              </p>
            ) : null}
          </Reveal>
          <ol className="mt-16 max-w-3xl">
            {about.teachers.map((teacher, teacherIndex) => {
              const lastTeacher = teacherIndex === about.teachers.length - 1;
              return (
                <li key={teacher.name}>
                  <Reveal delay={teacherIndex * 0.06}>
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
                            className={`relative pl-10 ${terminal ? "" : lastLine ? "pb-16" : "pb-8"}`}
                          >
                            {terminal ? null : (
                              <span
                                aria-hidden
                                className="absolute top-0 bottom-0 left-[6.5px] w-px bg-accent/25"
                              />
                            )}
                            <span
                              aria-hidden
                              className="absolute top-2 left-1 z-10 h-2 w-2 rounded-full bg-[var(--paper)] ring-1 ring-accent"
                            />
                            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                              {line}
                            </p>
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
      <div
        data-surface="light"
        className="surface-paper raised section-y border-t border-[var(--color-line)]"
      >
        <Container>
          <Reveal>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">{about.title}</h2>
            <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
              {about.lead}
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-[var(--color-muted)]">
              {paragraphs(about.story).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <h3 className="mt-12 text-2xl font-medium tracking-tight">{about.principlesTitle}</h3>
          </Reveal>
          <div className="mt-8 grid gap-8 border-t border-[var(--color-line)] pt-8 md:grid-cols-3">
            {about.principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <article>
                  <h4 className="text-lg font-medium">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
