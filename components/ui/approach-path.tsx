import { LineIcon } from "@/components/ui/line-icon";
import { Reveal } from "@/components/ui/reveal";

const ICONS = ["insight", "layers", "practice", "rhythm"] as const;

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="mt-16 border-t border-[var(--color-line)]">
      {steps.map((step, index) => (
        <li key={step.title} className="border-b border-[var(--color-line)]">
          <Reveal delay={index * 0.05}>
            <div className="py-6 lg:grid lg:grid-cols-[4.5rem_2rem_13rem_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:py-8">
              <div className="flex items-center gap-4 lg:contents">
                <span className="font-display text-5xl leading-none text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--accent)]">
                  <LineIcon name={ICONS[index] ?? "mark"} className="h-6 w-6" />
                </span>
                <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted)] lg:mt-0">
                {step.text}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
