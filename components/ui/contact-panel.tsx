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
}) {
  const point = readMapPoint(mapLatitude, mapLongitude, mapZoom);
  const iframeSrc = point ? yandexMapWidgetUrl(point) : mapEmbedUrl;
  const routeHref = point ? yandexRouteUrl(point) : routeUrl;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div>
        {lead ? <p className="max-w-md text-lg leading-relaxed text-muted">{lead}</p> : null}
        <ul className={`${lead ? "mt-6" : ""} space-y-3 text-base`}>
          <li>
            <a
              className="font-medium text-ink underline decoration-[#17171a]/30 underline-offset-4"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp · {phone}
            </a>
          </li>
          <li>
            <a
              className="underline decoration-line underline-offset-4"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {telegramLabel}
            </a>
          </li>
          <li>
            <a
              className="underline decoration-line underline-offset-4"
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
            className="rounded-full bg-[#17171a] px-5 py-3 text-sm font-medium text-[#f5f5f4]"
            target="_blank"
            rel="noreferrer"
          >
            {routeLabel}
          </a>
          <a
            href={mapUrl}
            className="rounded-full border border-[#17171a]/20 px-5 py-3 text-sm font-medium text-[#17171a]"
            target="_blank"
            rel="noreferrer"
          >
            {mapLinkLabel}
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgba(23,23,26,0.04)]">
        <iframe
          title={mapFrameTitle}
          src={iframeSrc}
          className="h-80 w-full border-0 md:h-[420px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
