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
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: "/privacy",
    },
  };
}

export default async function PrivacyPage() {
  const page = await getPrivacy();
  return (
    <section className="surface-paper pt-24 pb-16 md:pb-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl text-balance sm:text-5xl">{page.title}</h1>
        <p className="mt-6 rounded-2xl border border-[var(--color-line)] bg-[var(--paper-raised)] px-4 py-4 text-sm leading-relaxed text-[#17171a]">
          {page.notice}
        </p>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-[#3e4450]">
          {paragraphs(page.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
