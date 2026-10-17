import { readMapPoint, yandexMapWidgetUrl, yandexRouteUrl } from "@/lib/maps";

const mapFrameTitle = "Яндекс Карта: школа Djawda, улица Нурсултана Назарбаева, 23А";

export function ContactPanel({
  phone,
  whatsappUrl,
  telegramUrl,
  telegramLabel,
  instagramUrl,
  instagramLabel,
  address,
  mapUrl,
  mapLatitude,
  mapLongitude,
  mapZoom,
  mapEmbedUrl,
  routeUrl,
  routeLabel,
  mapLinkLabel,
  lead,
  stacked = false,
  showMap = true,
}: {
  phone: string;
  whatsappUrl: string;
  telegramUrl: string;
  telegramLabel: string;
  instagramUrl: string;
  instagramLabel: string;
  address: string;
  mapUrl: string;
  mapLatitude: string;
  mapLongitude: string;
  mapZoom: string;
  mapEmbedUrl: string;
  routeUrl: string;
  routeLabel: string;
  mapLinkLabel: string;
  lead?: string;
  stacked?: boolean;
  showMap?: boolean;
}) {
  const point = readMapPoint(mapLatitude, mapLongitude, mapZoom);
  const routeHref = point ? yandexRouteUrl(point) : routeUrl;

  return (
    <div
      className={
        showMap
          ? stacked
            ? "grid gap-6"
            : "grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start"
          : undefined
      }
    >
      <div>
        {lead ? <p className="max-w-md text-lg leading-relaxed text-muted">{lead}</p> : null}
        <ul className={`${lead ? "mt-6" : ""} space-y-3 text-base`}>
          <li>
            <a
              className="font-medium text-accent-faint underline decoration-accent-faint/50 underline-offset-4"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp · {phone}
            </a>
          </li>
          <li>
            <a
              className="text-accent-faint underline decoration-accent-faint/50 underline-offset-4"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {telegramLabel}
            </a>
          </li>
          <li>
            <a
              className="text-accent-faint underline decoration-accent-faint/50 underline-offset-4"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {instagramLabel}
            </a>
          </li>
          <li className="pt-2 text-muted">{address}</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={routeHref}
            className="rounded-full bg-[#f4f4f5] px-5 py-3 text-sm font-medium text-[#141416]"
            target="_blank"
            rel="noreferrer"
          >
            {routeLabel}
          </a>
          <a
            href={mapUrl}
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-[#f4f4f5]"
            target="_blank"
            rel="noreferrer"
          >
            {mapLinkLabel}
          </a>
        </div>
      </div>
      {showMap ? (
        <ContactMap
          mapLatitude={mapLatitude}
          mapLongitude={mapLongitude}
          mapZoom={mapZoom}
          mapEmbedUrl={mapEmbedUrl}
          className={stacked ? "h-72 sm:h-80" : "h-80 md:h-[420px]"}
        />
      ) : null}
    </div>
  );
}

export function ContactMap({
  mapLatitude,
  mapLongitude,
  mapZoom,
  mapEmbedUrl,
  className = "h-72 sm:h-80 lg:h-[26rem]",
}: {
  mapLatitude: string;
  mapLongitude: string;
  mapZoom: string;
  mapEmbedUrl: string;
  className?: string;
}) {
  const point = readMapPoint(mapLatitude, mapLongitude, mapZoom);
  const iframeSrc = point ? yandexMapWidgetUrl(point) : mapEmbedUrl;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#18181a]">
      <iframe
        title={mapFrameTitle}
        src={iframeSrc}
        className={`w-full border-0 ${className}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
