import { Reveal } from "@/components/ui/reveal";

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
      {steps.map((step, index) => (
        <li key={step.title} className="h-full">
          <Reveal from="right" delay={index * 0.08} className="h-full">
            <div className="h-full rounded-3xl border border-line bg-[#18181a] p-6">
              <span className="text-xs font-semibold tracking-[0.18em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
