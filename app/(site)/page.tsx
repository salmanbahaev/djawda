import type { Metadata } from "next";
import { ApproachSection } from "@/components/sections/approach";
import { AudienceSection } from "@/components/sections/audience";
import { ClassroomSection } from "@/components/sections/classroom";
import { ContactsSection } from "@/components/sections/contacts";
import { CoursesSection } from "@/components/sections/courses";
import { FaqSection } from "@/components/sections/faq";
import { FormatsSection } from "@/components/sections/formats";
import { HeroSection } from "@/components/sections/hero";
import { PathSection } from "@/components/sections/path";
import { TeachersSection } from "@/components/sections/teachers";
import { Marquee } from "@/components/ui/marquee";
import { getAbout, getCourses, getFormCopy, getHome, getSettings } from "@/lib/cms/content";
import { readMapPoint } from "@/lib/maps";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return {
    title: { absolute: home.seoTitle },
    description: home.seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: home.seoTitle,
      description: home.seoDescription,
      url: "/",
    },
  };
}

export default async function HomePage() {
  const [home, settings, about, courses, form] = await Promise.all([
    getHome(),
    getSettings(),
    getAbout(),
    getCourses(),
    getFormCopy(),
  ]);

  const point = readMapPoint(settings.mapLatitude, settings.mapLongitude, settings.mapZoom);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.wordmark,
    alternateName: settings.wordmarkRu,
    description: home.seoDescription,
    url: settings.siteUrl,
    telephone: "+79380008999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Нурсултана Назарбаева, 23А",
      addressLocality: "Грозный",
      addressCountry: "RU",
    },
    ...(point
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: point.latitude,
            longitude: point.longitude,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroSection home={home} settings={settings} />
      <Marquee items={courses.map((course) => course.title)} />
      <ApproachSection home={home} />
      <AudienceSection home={home} courses={courses} />
      <CoursesSection home={home} courses={courses} />
      <PathSection home={home} />
      <TeachersSection home={home} about={about} />
      <FormatsSection home={home} />
      <ClassroomSection home={home} />
      <FaqSection home={home} />
      <ContactsSection home={home} settings={settings} form={form} courses={courses} />
    </>
  );
}
