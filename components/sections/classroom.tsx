import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/lib/cms/content";
import { classroomIcon, type ClassroomIcon } from "@/lib/classroom-icons";
import Image from "next/image";

export function ClassroomSection({ home }: { home: HomeContent }) {
  const wide = home.classroomWideImage;
  const portrait = home.classroomPortraitImage;

  return (
    <section
      id="classroom"
      data-surface="dark"
      className="classroom-section section-y border-t border-[var(--color-line)]"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <Reveal>
            <Eyebrow index={7}>{home.classroomEyebrow}</Eyebrow>
            <h2 className="mt-4 text-4xl text-balance text-[var(--paper)] sm:text-5xl">
              {home.classroomTitle}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-[var(--paper)] sm:text-lg">
              {home.classroomLead}
            </p>
            <ul className="mt-8 max-w-md space-y-6">
              {home.classroomFeatures.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--paper)]/40 text-[var(--paper)]">
                    <FeatureIcon name={classroomIcon(item.icon)} />
                  </span>
                  <span>
                    <span className="block text-base font-medium text-[var(--paper)]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--paper)]">
                      {item.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          {wide || portrait ? (
            <Reveal>
              <ClassroomPhotos
                wide={wide}
                wideAlt={home.classroomWideAlt}
                portrait={portrait}
                portraitAlt={home.classroomPortraitAlt}
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function ClassroomPhotos({
  wide,
  wideAlt,
  portrait,
  portraitAlt,
}: {
  wide: string | null;
  wideAlt: string;
  portrait: string | null;
  portraitAlt: string;
}) {
  return (
    <div className={`classroom-collage relative ${wide && portrait ? "lg:pb-24" : ""}`}>
      {wide ? (
        <div className="classroom-frame relative overflow-hidden rounded-3xl lg:w-[84%]">
          <div className="relative aspect-[4/3]">
            <Image
              src={wide}
              alt={wideAlt}
              fill
              sizes="(min-width: 1024px) 32rem, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      {portrait ? (
        <div
          className={
            wide
              ? "classroom-frame relative mt-4 overflow-hidden rounded-3xl lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-[46%]"
              : "classroom-frame relative overflow-hidden rounded-3xl lg:ml-auto lg:w-[62%]"
          }
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={portrait}
              alt={portraitAlt}
              fill
              sizes="(min-width: 1024px) 18rem, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeatureIcon({ name }: { name: ClassroomIcon | null }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "h-[1.15rem] w-[1.15rem]",
  };

  if (name === "board") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
        <path d="M7 9.5h7M7 12.5h4.5" />
      </svg>
    );
  }
  if (name === "group") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="2.2" />
        <circle cx="16" cy="9" r="1.7" />
        <path d="M4.6 18.5c.55-2.3 2.3-3.6 4.4-3.6s3.85 1.3 4.4 3.6" />
        <path d="M13.6 15.3c.65-.4 1.5-.7 2.5-.7 1.55 0 2.85.75 3.35 2.4" />
      </svg>
    );
  }
  if (name === "room") {
    return (
      <svg {...common}>
        <path d="M7.5 10.5V7.2A1.2 1.2 0 0 1 8.7 6h6.6a1.2 1.2 0 0 1 1.2 1.2v3.3" />
        <path d="M5.5 10.5h13v3.2a1.3 1.3 0 0 1-1.3 1.3H6.8a1.3 1.3 0 0 1-1.3-1.3z" />
        <path d="M8 15v3.5M16 15v3.5" />
      </svg>
    );
  }
  if (name === "books") {
    return (
      <svg {...common}>
        <path d="M4.5 5.5h6A2.5 2.5 0 0 1 13 8v11.2H6.8A2.3 2.3 0 0 0 4.5 21.5Z" />
        <path d="M19.5 5.5h-6A2.5 2.5 0 0 0 11 8v11.2h6.2a2.3 2.3 0 0 1 2.3 2.3Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}
