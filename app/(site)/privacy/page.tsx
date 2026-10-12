import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getPrivacy } from "@/lib/cms/content";
import { paragraphs } from "@/lib/cms/text";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacy();
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const page = await getPrivacy();
  return (
    <section className="bg-[#0f0f10] py-16 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{page.title}</h1>
        <p className="mt-6 rounded-3xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-relaxed">
          {page.notice}
        </p>
        <div className="mt-8 space-y-4 leading-relaxed text-muted">
          {paragraphs(page.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
