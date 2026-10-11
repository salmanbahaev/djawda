import { HeroCanvas } from "@/components/ui/hero-canvas";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { Magnetic } from "@/components/ui/magnetic";
import { Mark } from "@/components/ui/mark";
import { Container } from "@/components/ui/container";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";
import Link from "next/link";

export function HeroSection({ home, settings }: { home: HomeContent; settings: SettingsContent }) {
  return (
    <section id="hero" className="relative scroll-mt-20 overflow-hidden bg-teal-950 text-white">
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-teal-950 via-teal-950/70 to-transparent lg:w-[58%]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,25,32,0.45)_100%)]" />
      <Container className="relative z-10 grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-gold-2 uppercase">
            {settings.audienceNote}
          </p>
          <KineticHeading
            text={home.heroTitle}
            className="mt-5 max-w-xl text-5xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl"
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{home.heroSubtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={home.heroPrimaryHref}
                className="block rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-teal-900 transition duration-200 hover:bg-gold-2"
              >
                {home.heroPrimaryLabel}
              </Link>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={home.heroSecondaryHref}
                className="block rounded-full border border-white/35 bg-white/5 px-6 py-3 text-center text-sm font-medium backdrop-blur-sm transition duration-200 hover:border-white hover:bg-white/15"
              >
                {home.heroSecondaryLabel}
              </Link>
            </Magnetic>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.65)] backdrop-blur-md">
            <Mark src={settings.logo} alt={settings.logoAlt || ""} height={240} priority />
          </div>
        </div>
      </Container>
    </section>
  );
}
