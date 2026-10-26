import { HeroThreads } from "@/components/ui/backgrounds/hero-threads";
import { Container } from "@/components/ui/container";
import { Mark } from "@/components/ui/mark";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";
import Link from "next/link";

export function HeroSection({ home, settings }: { home: HomeContent; settings: SettingsContent }) {
  return (
    <section id="hero" data-surface="dark" className="surface-dark relative overflow-hidden">
      <HeroThreads />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(15,15,16,0.82)_0%,rgba(15,15,16,0.46)_48%,rgba(15,15,16,0.18)_100%)]"
      />
      <Container className="relative z-10 flex min-h-[100svh] items-center pt-24 pb-16 md:pt-28">
        <div className="grid w-full items-center gap-8 md:grid-cols-[minmax(0,auto)_1fr] md:gap-12">
          <Mark
            src={settings.logo}
            alt={settings.logoAlt || ""}
            priority
            className="hero-mark h-16 sm:h-20 md:pointer-events-none md:col-start-2 md:row-start-1 md:h-[clamp(11.25rem,calc(11.25rem+(100vw-48rem)*25/144),23.75rem)] md:justify-self-center"
          />
          <div className="w-full max-w-[680px] md:col-start-1 md:row-start-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#d7e4ea] uppercase">
              {settings.audienceNote}
            </p>
            <h1 className="mt-6 max-w-[680px] bg-gradient-to-r from-[#f7f4ee] to-[#b7c9d2] bg-clip-text text-5xl text-balance text-transparent sm:text-6xl lg:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-[680px] text-base leading-relaxed text-pretty text-[#e6e6ea] sm:text-lg">
              {home.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={home.heroSecondaryHref}
                className="press inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--paper)] px-4 text-base font-semibold text-[var(--accent)] hover:bg-[var(--paper-raised)] sm:w-auto"
              >
                {home.heroSecondaryLabel}
              </Link>
              <Link
                href={home.heroPrimaryHref}
                className="press inline-flex min-h-11 items-center text-base font-semibold text-[#f5efe4] underline decoration-[#f5efe4]/50 underline-offset-4 hover:decoration-[#f5efe4]"
              >
                {home.heroPrimaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
