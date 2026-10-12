import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionProvider } from "@/components/layout/motion-provider";
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
      images: image ? [image] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, footer] = await Promise.all([getSettings(), getFooter()]);

  return (
    <MotionProvider>
      <SmoothScroll />
      <Header
        logo={settings.logo}
        logoAlt={settings.logoAlt || ""}
        wordmark={settings.wordmark}
        wordmarkRu={settings.wordmarkRu}
        nav={settings.nav}
        navCta={settings.navCta}
      />
      <SectionProgress />
      <main>{children}</main>
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
    </MotionProvider>
  );
}
