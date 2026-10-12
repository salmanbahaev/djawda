import type { Metadata } from "next";
import { Cormorant, Manrope } from "next/font/google";
import { ReaderRefresh } from "@keystatic/next/reader-refresh";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionProvider } from "@/components/layout/motion-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { getFooter, getSettings, reader } from "@/lib/cms/content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

const cormorant = Cormorant({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-cormorant",
});

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, footer] = await Promise.all([getSettings(), getFooter()]);

  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
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
          <ReaderRefresh reader={reader} />
        </MotionProvider>
      </body>
    </html>
  );
}
