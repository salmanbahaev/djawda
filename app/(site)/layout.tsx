import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionProvider } from "@/components/layout/motion-provider";
import { StickyEnroll } from "@/components/layout/sticky-enroll";
import { SectionProgress } from "@/components/ui/section-progress";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { getFooter, getSettings } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const image = settings.ogImage;
  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s — ${settings.wordmark}`,
    },
    description: settings.defaultSeoDescription,
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: `${settings.wordmark} / ${settings.wordmarkRu}`,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: settings.ogImageAlt || settings.defaultSeoTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      images: image ? [image] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0f0f10",
};

export default async function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, footer] = await Promise.all([getSettings(), getFooter()]);

  return (
    <MotionProvider>
      <SmoothScroll />
      <a className="skip-link" href="#content">
        К содержанию
      </a>
      <Header
        logo={settings.logo}
        logoAlt={settings.logoAlt || ""}
        wordmark={settings.wordmark}
        wordmarkRu={settings.wordmarkRu}
        nav={settings.nav}
        navCta={settings.navCta}
      />
      <SectionProgress />
      <main id="content" tabIndex={-1} className="max-md:pb-20">
        {children}
      </main>
      <Footer
        logo={settings.logo}
        logoAlt={settings.logoAlt || ""}
        wordmark={settings.wordmark}
        wordmarkRu={settings.wordmarkRu}
        blurb={footer.blurb}
        privacyLabel={footer.privacyLabel}
        rights={footer.rights}
        phone={settings.phoneDisplay}
        whatsappUrl={settings.whatsappUrl || ""}
        telegramUrl={settings.telegramUrl || ""}
        telegramLabel={settings.telegramLabel}
        instagramUrl={settings.instagramUrl || ""}
        instagramLabel={settings.instagramLabel}
        address={settings.address}
      />
      <StickyEnroll />
    </MotionProvider>
  );
}
