import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const DEFAULT_CENTER = [16, 104];
const DEFAULT_ZOOM = 4;

export default function MapController({ points, selectedPartner, fitRequest, sidebarVisible }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 260);
    return () => window.clearTimeout(timer);
  }, [map, sidebarVisible]);

  useEffect(() => {
    if (!selectedPartner) return;
    map.flyTo([selectedPartner.latitude, selectedPartner.longitude], Math.max(map.getZoom(), 9), { duration: 0.65 });
  }, [map, selectedPartner]);

  useEffect(() => {
    if (!fitRequest) return;
    if (!points.length) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (points.length === 1) {
      map.flyTo([points[0].latitude, points[0].longitude], 9);
      return;
    }
    const bounds = L.latLngBounds(points.map((partner) => [partner.latitude, partner.longitude]));
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 9 });
  }, [fitRequest, map, points]);

  return null;
}
