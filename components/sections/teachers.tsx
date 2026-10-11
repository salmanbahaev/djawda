import { Container, Eyebrow } from "@/components/ui/container";
import type { AboutContent, HomeContent } from "@/lib/cms/content";
import { paragraphs } from "@/lib/cms/text";

export function TeachersSection({ home, about }: { home: HomeContent; about: AboutContent }) {
  return (
    <section id="teachers" className="scroll-mt-20">
      <div className="bg-teal-950 py-20 text-white md:py-28">
        <Container>
          <Eyebrow light>{home.teachersEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
            {home.teachersTitle}
          </h2>
          {home.teachersLead ? (
            <p className="mt-5 max-w-2xl text-white/75">{home.teachersLead}</p>
          ) : null}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {about.teachers.map((teacher) => (
              <article
                key={teacher.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
              >
                <h3 className="text-2xl font-medium">{teacher.name}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
                  {teacher.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </div>
      <div className="bg-white py-20 md:py-28">
        <Container>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
            {about.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{about.lead}</p>
          <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-muted">
            {paragraphs(about.story).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <h3 className="mt-12 text-2xl font-medium tracking-tight">{about.principlesTitle}</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {about.principles.map((item) => (
              <li key={item.title} className="rounded-3xl border border-line bg-paper p-5">
                <h4 className="text-lg font-medium">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
