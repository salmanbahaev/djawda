import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function AudienceSection({ home }: { home: HomeContent }) {
  return (
    <section id="audience" className="scroll-mt-20 bg-white py-20 md:py-28">
      <Container>
        <Eyebrow>{home.audienceEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          {home.audienceTitle}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {home.audienceItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-3xl border border-line bg-paper p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-gold">
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
