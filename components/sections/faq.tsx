import { Container, Eyebrow } from "@/components/ui/container";
import { FaqList } from "@/components/ui/faq-list";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function FaqSection({ home }: { home: HomeContent }) {
  return (
    <section id="faq" data-surface="light" className="tone-light py-24 md:py-32">
      <Container>
        <Reveal from="left">
          <Eyebrow>{home.faqEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">{home.faqTitle}</h2>
        </Reveal>
        <Reveal from="right">
          <div className="mt-8">
            <FaqList items={home.faq} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
