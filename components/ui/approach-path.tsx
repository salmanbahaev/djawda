import { LineIcon } from "@/components/ui/line-icon";
import { Reveal } from "@/components/ui/reveal";

const ICONS = ["insight", "layers", "practice", "rhythm"] as const;

export function ApproachPath({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {steps.map((step, index) => (
        <li key={step.title} className="h-full">
          <Reveal from="right" delay={index * 0.06} className="h-full">
            <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#141416]/80 p-5 motion-reduce:transition-none sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-accent-faint">
                  <LineIcon name={ICONS[index] ?? "mark"} className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold tracking-[0.18em] text-accent-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
