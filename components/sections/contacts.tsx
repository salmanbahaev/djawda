import { ContactMap, ContactPanel } from "@/components/ui/contact-panel";
import { Container, Eyebrow } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent, SettingsContent } from "@/lib/cms/content";

export function ContactsSection({
  home,
  settings,
}: {
  home: HomeContent;
  settings: SettingsContent;
}) {
  return (
    <section
      id="contacts"
      data-surface="dark"
      className="surface-dark section-y border-t border-[var(--color-line)]"
    >
      <Container className="grid gap-12">
        <Reveal>
          <Eyebrow index={9}>{home.contactsEyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-[680px] text-4xl text-balance sm:text-5xl">
            {home.contactsTitle}
          </h2>
        </Reveal>
        <Reveal>
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
            showMap={false}
          />
        </Reveal>
        <Reveal>
          <ContactMap
            mapLatitude={settings.mapLatitude}
            mapLongitude={settings.mapLongitude}
            mapZoom={settings.mapZoom}
            mapEmbedUrl={settings.mapEmbedUrl || ""}
            className="h-64 md:h-96"
          />
        </Reveal>
      </Container>
    </section>
  );
}
