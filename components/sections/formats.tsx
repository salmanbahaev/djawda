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

function FormatHalf({ items, tone }: { items: readonly FormatItem[]; tone: "paper" | "slate" }) {
  const paper = tone === "paper";
  return (
    <div
      className={paper ? "bg-[var(--paper-raised)] text-[#17171a]" : "bg-[#0f2f3a] text-[#f5efe4]"}
    >
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`px-6 py-8 sm:px-10 sm:py-12 ${
            index > 0 ? (paper ? "border-t border-[#0f0f10]/10" : "border-t border-white/15") : ""
          }`}
        >
          <span className={paper ? "text-[#0f2f3a]" : "text-[#9eb4c2]"}>
            <LineIcon name={paper ? "place" : "screen"} />
          </span>
          <h3 className="mt-8 font-display text-4xl leading-none tracking-tight sm:text-5xl">
            {item.title}
          </h3>
          <p
            className={`mt-4 max-w-md text-base leading-relaxed ${
              paper ? "text-[#3f3f46]" : "text-[#d7e4ea]"
            }`}
          >
            {item.text}
          </p>
        </article>
      ))}
    </div>
  );
}

export function FormatsSection({ home }: { home: HomeContent }) {
  const offline = home.formats.filter((item) => formatKind(item) === "offline");
  const online = home.formats.filter((item) => formatKind(item) === "online");
  const notes = home.formats.filter((item) => formatKind(item) === "note");
  const split = offline.length > 0 && online.length > 0;

  return (
    <section
      id="formats"
      data-surface="light"
      className="surface-paper section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <Reveal>
          <Eyebrow index={6}>{home.formatsEyebrow}</Eyebrow>
          <h2 className="mt-4 text-4xl text-balance sm:text-5xl">{home.formatsTitle}</h2>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
            {home.formatsLead}
          </p>
        </Reveal>
        <Reveal>
          <div
            className={`mt-12 overflow-hidden rounded-3xl border border-[var(--color-line)] ${split ? "md:grid md:grid-cols-2" : ""}`}
          >
            {offline.length > 0 ? <FormatHalf items={offline} tone="paper" /> : null}
            {online.length > 0 ? <FormatHalf items={online} tone="slate" /> : null}
          </div>
        </Reveal>
        {notes.length > 0 ? (
          <div className="mt-10 border-t border-[var(--color-line)]">
            {notes.map((item) => (
              <Reveal key={item.title}>
                <div className="border-b border-[var(--color-line)] py-6">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
        <Reveal>
          <div
            className={notes.length > 0 ? "py-8" : "mt-10 border-t border-[var(--color-line)] py-8"}
          >
            <h3 className="text-xl font-medium">{home.enrollmentTitle}</h3>
            <ol className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
              {home.enrollmentSteps.map((step, index) => (
                <li key={step} className="text-sm leading-relaxed">
                  <span className="mb-2 block font-display text-2xl leading-none text-[var(--accent)]">
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
