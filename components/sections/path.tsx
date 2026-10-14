import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

export function PathSection({ home }: { home: HomeContent }) {
  const steps = home.pathSteps;
  const count = steps.length;

  return (
    <section id="path" data-surface="dark" className="path-section py-24 md:py-32">
      <Container className="relative z-10">
        <Reveal from="left">
          <Eyebrow>{home.pathEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
            {home.pathTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{home.pathLead}</p>
        </Reveal>
        <ol
          className="relative mt-14 flex flex-col gap-8 lg:grid lg:gap-6"
          style={{ gridTemplateColumns: `repeat(${Math.max(count, 1)}, minmax(0, 1fr))` }}
        >
          {count > 1 ? (
            <span
              aria-hidden
              className="absolute top-5 hidden h-px -translate-y-1/2 bg-white/20 lg:block"
              style={{ left: `${50 / count}%`, width: `${100 - 100 / count}%` }}
            />
          ) : null}
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 lg:block lg:text-center">
              {index < count - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-5 left-5 w-px -translate-x-1/2 bg-white/20 lg:hidden"
                  style={{ bottom: "calc(-2rem - 1.25rem)" }}
                />
              ) : null}
              <div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-[#0f0f10] text-xs font-semibold text-accent-faint lg:mx-auto">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0 pt-1 lg:pt-0">
                <h3 className="text-xl font-medium tracking-tight lg:mt-5">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
