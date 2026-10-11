import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FlowFieldLazy } from "@/components/ui/flow-field-lazy";
import { Mark } from "@/components/ui/mark";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";

export function HeroSection({ home, settings }: { home: HomeContent; settings: SettingsContent }) {
  return (
    <section id="hero" className="relative scroll-mt-20 overflow-hidden bg-teal-900 text-white">
      <FlowFieldLazy />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,61,82,0.2)_55%,rgba(2,25,32,0.55)_100%)]" />
      <Container className="relative grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-gold-2 uppercase">
            {settings.audienceNote}
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{home.heroSubtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={home.heroPrimaryHref}
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-teal-900"
            >
              {home.heroPrimaryLabel}
            </Link>
            <Link
              href={home.heroSecondaryHref}
              className="rounded-full border border-white/30 px-5 py-3 text-center text-sm font-medium"
            >
              {home.heroSecondaryLabel}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Mark src={settings.logo} alt={settings.logoAlt || ""} height={280} priority />
        </div>
      </Container>
    </section>
  );
}
