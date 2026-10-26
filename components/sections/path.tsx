import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function PathSection({ home }: { home: HomeContent }) {
  const steps = home.pathSteps;
  const count = steps.length;

  return (
    <section
      id="path"
      data-surface="dark"
      className="surface-dark section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <Reveal>
          <Eyebrow index={4}>{home.pathEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">{home.pathTitle}</h2>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
            {home.pathLead}
          </p>
        </Reveal>
        <ol
          className="relative mt-16 lg:grid lg:gap-8"
          style={{ gridTemplateColumns: `repeat(${Math.max(count, 1)}, minmax(0, 1fr))` }}
        >
          {count > 1 ? (
            <span
              aria-hidden
              className="absolute hidden h-px -translate-y-1/2 bg-[var(--color-line)] lg:block"
              style={{
                top: "1.7rem",
                left: `${50 / count}%`,
                width: `${100 - 100 / count}%`,
              }}
            />
          ) : null}
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-t border-[var(--color-line)] py-8 first:border-t-0 first:pt-0 lg:border-t-0 lg:py-0 lg:text-center"
            >
              <p className="relative z-10 inline-block bg-[var(--ink)] pr-3 font-display text-6xl leading-none text-[var(--accent-soft)] lg:px-3">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] lg:mx-auto lg:max-w-[16rem]">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
