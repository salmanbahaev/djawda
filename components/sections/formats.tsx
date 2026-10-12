import { Container, Eyebrow } from "@/components/ui/container";
import type { HomeContent } from "@/lib/cms/content";

export function FormatsSection({ home }: { home: HomeContent }) {
  return (
    <section
      id="formats"
      data-surface="light"
      className="tone-light surface-2 scroll-mt-20 py-24 md:py-32"
    >
      <Container>
        <Eyebrow>{home.formatsEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          {home.formatsTitle}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{home.formatsLead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {home.formats.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(23,23,26,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b0b0ab]"
            >
              <h3 className="text-xl font-medium">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(23,23,26,0.04)] sm:p-8">
          <h3 className="text-xl font-medium">{home.enrollmentTitle}</h3>
          <ol className="mt-5 grid gap-4 sm:grid-cols-5">
            {home.enrollmentSteps.map((step, index) => (
              <li key={step} className="text-sm leading-relaxed">
                <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
