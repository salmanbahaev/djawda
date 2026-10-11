import { Container, Eyebrow } from "@/components/ui/container";
import { FaqList } from "@/components/ui/faq-list";
import type { HomeContent } from "@/lib/cms/content";

export function FaqSection({ home }: { home: HomeContent }) {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-20 md:py-28">
      <Container>
        <Eyebrow>{home.faqEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">{home.faqTitle}</h2>
        <div className="mt-8">
          <FaqList items={home.faq} />
        </div>
      </Container>
    </section>
  );
}
