import { LineIcon } from "@/components/ui/line-icon";
import { Reveal } from "@/components/ui/reveal";

const ICONS = ["insight", "layers", "practice", "rhythm"] as const;

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="mt-14 border-t border-white/15">
      {steps.map((step, index) => (
        <li key={step.title} className="border-b border-white/15">
          <Reveal from="right" delay={index * 0.05}>
            <div className="py-7 lg:grid lg:grid-cols-[4.5rem_2rem_13rem_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:py-8">
              <div className="flex items-center gap-4 lg:contents">
                <span className="font-display text-5xl leading-none text-accent-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-accent-faint">
                  <LineIcon name={ICONS[index] ?? "mark"} className="h-5 w-5" />
                </span>
                <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted lg:mt-0">
                {step.text}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
