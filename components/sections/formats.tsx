import { LineIcon } from "@/components/ui/line-icon";
import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";

type FormatItem = HomeContent["formats"][number];

function formatKind(item: FormatItem) {
  if (item.kind === "offline" || item.kind === "online" || item.kind === "note") return item.kind;
  const title = item.title.toLowerCase();
  if (title.includes("офлайн")) return "offline";
  if (title.includes("онлайн")) return "online";
  return "note";
}

function FormatCard({ item, tone }: { item: FormatItem; tone: "paper" | "slate" }) {
  const paper = tone === "paper";
  return (
    <article
      className={
        paper
          ? "flex h-full flex-col rounded-[1.75rem] bg-[#f5efe4] p-6 text-[#17171a] sm:p-8"
          : "flex h-full flex-col rounded-[1.75rem] bg-[#0f2f3a] p-6 text-[#f5efe4] sm:p-8"
      }
    >
      <span className={paper ? "text-[#0f2f3a]" : "text-[#9eb4c2]"}>
        <LineIcon name={paper ? "place" : "screen"} />
      </span>
      <h3 className="mt-6 text-2xl font-medium tracking-tight">{item.title}</h3>
      <p className={`mt-3 text-sm leading-relaxed ${paper ? "text-[#3f3f46]" : "text-[#d7e4ea]"}`}>
        {item.text}
      </p>
    </article>
  );
}

export function FormatsSection({ home }: { home: HomeContent }) {
  const offline = home.formats.filter((item) => formatKind(item) === "offline");
  const online = home.formats.filter((item) => formatKind(item) === "online");
  const notes = home.formats.filter((item) => formatKind(item) === "note");

  return (
    <section id="formats" data-surface="dark" className="section-glow-left py-24 md:py-32">
      <Container>
        <Reveal from="left">
          <Eyebrow>{home.formatsEyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
            {home.formatsTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{home.formatsLead}</p>
        </Reveal>
        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2 md:gap-5">
          <div className="flex h-full flex-col gap-4">
            {offline.map((item, index) => (
              <Reveal key={item.title} from="left" delay={index * 0.06} className="h-full flex-1">
                <FormatCard item={item} tone="paper" />
              </Reveal>
            ))}
          </div>
          <div className="flex h-full flex-col gap-4">
            {online.map((item, index) => (
              <Reveal key={item.title} from="right" delay={index * 0.06} className="h-full flex-1">
                <FormatCard item={item} tone="slate" />
              </Reveal>
            ))}
          </div>
        </div>
        {notes.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {notes.map((item) => (
              <Reveal key={item.title} from="right">
                <article className="rounded-3xl border border-white/10 px-6 py-5 sm:px-8">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}
        <Reveal from="right" delay={0.08}>
          <div className="mt-8 rounded-3xl border border-white/10 px-6 py-6 sm:px-8">
            <h3 className="text-xl font-medium">{home.enrollmentTitle}</h3>
            <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {home.enrollmentSteps.map((step, index) => (
                <li key={step} className="text-sm leading-relaxed">
                  <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-accent-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
