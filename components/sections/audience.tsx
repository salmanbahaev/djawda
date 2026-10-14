import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function AudienceSection({ home }: { home: HomeContent }) {
  return (
    <section id="audience" data-surface="light" className="tone-light py-24 md:py-32">
      <Container>
        <Reveal from="left">
          <Eyebrow>{home.audienceEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
            {home.audienceTitle}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {home.audienceItems.map((item, index) => (
            <Reveal
              key={item.title}
              from="right"
              delay={index * 0.08}
              className={
                index === 0 ? "md:col-span-4" : index === 1 ? "md:col-span-2" : "md:col-span-3"
              }
            >
              <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(23,23,26,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b0b0ab]">
                <p className="text-xs font-semibold tracking-[0.18em] text-accent-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
