import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

export default function HeatmapLayer({ points, radius, intensity }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return undefined;
    const heatPoints = points.map((partner) => [partner.latitude, partner.longitude, intensity]);
    const layer = L.heatLayer(heatPoints, {
      radius,
      blur: Math.max(12, Math.round(radius * 0.72)),
      maxZoom: 10,
      minOpacity: 0.3,
      gradient: { 0.2: "#ffd5d9", 0.45: "#ef5b66", 0.7: "#bd1423", 1: "#680008" },
    }).addTo(map);
    return () => map.removeLayer(layer);
  }, [map, points, radius, intensity]);

  return null;
}
