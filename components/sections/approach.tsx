import { ApproachPath } from "@/components/ui/approach-path";
import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function ApproachSection({ home }: { home: HomeContent }) {
  return (
    <section id="approach" data-surface="dark" className="section-glow py-24 md:py-32">
      <Container>
        <Reveal from="left">
          <Eyebrow>{home.approachEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
            {home.approachTitle}
          </h2>
          <p className="prose-measure mt-6 text-lg leading-relaxed text-muted">
            {home.approachText}
          </p>
        </Reveal>
        <ApproachPath steps={home.approachSteps} />
      </Container>
    </section>
  );
}
