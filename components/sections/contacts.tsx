import { ContactMap, ContactPanel } from "@/components/ui/contact-panel";
import { Container, Eyebrow } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Reveal } from "@/components/ui/reveal";
import type { CourseContent, FormContent, HomeContent, SettingsContent } from "@/lib/cms/content";

export function ContactsSection({
  home,
  settings,
  form,
  courses,
}: {
  home: HomeContent;
  settings: SettingsContent;
  form: FormContent;
  courses: CourseContent[];
}) {
  return (
    <section id="contacts" data-surface="dark" className="section-glow-bottom py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-12">
        <Reveal from="left" className="order-1">
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
              showMap={false}
            />
          </div>
        </Reveal>
        <Reveal from="right" className="order-3 lg:order-2">
          <div id="lead">
            <Eyebrow>{home.finalEyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              {home.finalTitle}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{home.finalText}</p>
            <div className="mt-6 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
              <LeadForm
                copy={{
                  ...form,
                  formats: form.formats.map((item) => ({ value: item.value, label: item.label })),
                }}
                courses={courses.map((course) => ({ slug: course.slug, title: course.title }))}
                whatsappUrl={settings.whatsappUrl || ""}
              />
            </div>
          </div>
        </Reveal>
        <Reveal from="left" className="order-2 lg:order-3 lg:col-span-2">
          <ContactMap
            mapLatitude={settings.mapLatitude}
            mapLongitude={settings.mapLongitude}
            mapZoom={settings.mapZoom}
            mapEmbedUrl={settings.mapEmbedUrl || ""}
          />
        </Reveal>
      </Container>
    </section>
  );
}
