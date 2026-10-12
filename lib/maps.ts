export type MapPoint = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export function readMapPoint(
  latitude: string | null | undefined,
  longitude: string | null | undefined,
  zoom: string | null | undefined,
): MapPoint | null {
  const lat = Number(
    String(latitude ?? "")
      .trim()
      .replace(",", "."),
  );
  const lon = Number(
    String(longitude ?? "")
      .trim()
      .replace(",", "."),
  );
  const parsedZoom = Number(
    String(zoom ?? "")
      .trim()
      .replace(",", "."),
  );
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return null;
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) return null;
  const safeZoom = Number.isFinite(parsedZoom)
    ? Math.min(19, Math.max(1, Math.round(parsedZoom)))
    : 17;
  return { latitude: lat, longitude: lon, zoom: safeZoom };
}

export function yandexMapWidgetUrl(point: MapPoint) {
  const ll = `${point.longitude},${point.latitude}`;
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${point.zoom}&pt=${ll},pm2rdm`;
}

export function yandexRouteUrl(point: MapPoint) {
  return `https://yandex.ru/maps/?rtext=~${point.latitude},${point.longitude}&rtt=auto`;
}
