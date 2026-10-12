import { ContactPanel } from "@/components/ui/contact-panel";
import { Container, Eyebrow } from "@/components/ui/container";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";

export function ContactsSection({
  home,
  settings,
}: {
  home: HomeContent;
  settings: SettingsContent;
}) {
  return (
    <section id="contacts" data-surface="light" className="tone-light scroll-mt-20 py-24 md:py-32">
      <Container>
        <Eyebrow>{home.contactsEyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          {home.contactsTitle}
        </h2>
        <div className="mt-8">
          <ContactPanel
            phone={settings.phoneDisplay}
            whatsappUrl={settings.whatsappUrl || ""}
            telegramUrl={settings.telegramUrl || ""}
            telegramLabel={settings.telegramLabel}
            instagramUrl={settings.instagramUrl || ""}
            instagramLabel={settings.instagramLabel}
            address={settings.address}
            mapUrl={settings.mapUrl || ""}
            mapLatitude={settings.mapLatitude}
            mapLongitude={settings.mapLongitude}
            mapZoom={settings.mapZoom}
            mapEmbedUrl={settings.mapEmbedUrl || ""}
            routeUrl={settings.routeUrl || ""}
            routeLabel={settings.routeLabel}
            mapLinkLabel={settings.mapLinkLabel}
            lead={home.contactsLead}
          />
        </div>
      </Container>
    </section>
  );
}
