import { Container, Eyebrow } from "@/components/ui/container";
import { FaqList } from "@/components/ui/faq-list";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function FaqSection({ home }: { home: HomeContent }) {
  return (
    <section
      id="faq"
      data-surface="light"
      className="surface-paper section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <Reveal>
          <Eyebrow index={8}>{home.faqEyebrow}</Eyebrow>
          <h2 className="mt-4 text-4xl text-balance sm:text-5xl">{home.faqTitle}</h2>
        </Reveal>
        <Reveal>
          <div className="mt-12">
            <FaqList items={home.faq} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
