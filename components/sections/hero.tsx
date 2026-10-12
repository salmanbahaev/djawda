import { SilkBackground } from "@/components/ui/silk-background";
import { Magnetic } from "@/components/ui/magnetic";
import { Mark } from "@/components/ui/mark";
import { Container } from "@/components/ui/container";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";
import Link from "next/link";

export function HeroSection({ home, settings }: { home: HomeContent; settings: SettingsContent }) {
  return (
    <section
      id="hero"
      data-surface="dark"
      className="relative overflow-hidden bg-[#070708] text-white"
    >
      <SilkBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,transparent_0%,rgba(0,0,0,0.28)_55%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
      <Container className="relative z-10 flex min-h-[calc(100svh-4.5rem)] items-center py-20 lg:py-24">
        <div className="grid w-full items-center md:grid-cols-[minmax(0,auto)_1fr]">
          <Mark
            src={settings.logo}
            alt={settings.logoAlt || ""}
            priority
            className="hero-mark h-14 sm:h-16 md:pointer-events-none md:col-start-2 md:row-start-1 md:h-[clamp(11.25rem,calc(11.25rem+(100vw-48rem)*25/144),23.75rem)] md:justify-self-center"
          />
          <div className="w-full max-w-2xl md:col-start-1 md:row-start-1 md:w-fit md:min-w-0">
            <p className="mt-8 text-[0.72rem] font-medium tracking-[0.34em] text-[#b9b9be] uppercase">
              {settings.audienceNote}
            </p>
            <h1 className="mt-5 max-w-2xl text-5xl font-light tracking-[-0.04em] text-balance text-white sm:text-6xl md:text-6xl lg:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed font-light text-[#cfcfd2] sm:text-lg">
              {home.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href={home.heroPrimaryHref}
                  className="block rounded-full bg-[#f4f4f5] px-6 py-3 text-center text-sm font-medium text-[#141416] transition duration-200 hover:bg-white"
                >
                  {home.heroPrimaryLabel}
                </Link>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href={home.heroSecondaryHref}
                  className="block rounded-full border border-white/30 px-6 py-3 text-center text-sm font-medium text-[#f4f4f5] transition duration-200 hover:border-white/70"
                >
                  {home.heroSecondaryLabel}
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
