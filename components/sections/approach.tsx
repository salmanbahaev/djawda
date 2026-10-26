import { ApproachPath } from "@/components/ui/approach-path";
import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function ApproachSection({ home }: { home: HomeContent }) {
  return (
    <section
      id="approach"
      data-surface="light"
      className="surface-paper section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <Reveal>
          <Eyebrow index={1}>{home.approachEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">
            {home.approachTitle}
          </h2>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
            {home.approachText}
          </p>
        </Reveal>
        <ApproachPath steps={home.approachSteps} />
      </Container>
    </section>
  );
}
