import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { env } from "../../../config/env.js";
import HeatmapLayer from "./HeatmapLayer.jsx";
import MapController from "./MapController.jsx";
import PartnerMarker from "./PartnerMarker.jsx";

const DEFAULT_CENTER = [16, 104];

function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const densityLevel = Math.min(1, Math.log2(count + 1) / 8);
  const densityRadius = Math.round(20 + densityLevel * 52);
  const densityOpacity = (0.22 + densityLevel * 0.38).toFixed(2);

  return L.divIcon({
    html: `<span style="--density-radius:${densityRadius}px;--density-opacity:${densityOpacity}">${count.toLocaleString("vi-VN")}</span>`,
    className: `partner-cluster ${count >= 100 ? "large" : count >= 20 ? "medium" : "small"}`,
    iconSize: L.point(46, 46, true),
  });
}

export default function PartnerMap({
  points,
  mapLayers,
  radius,
  intensity,
  selectedPartner,
  onSelectPartner,
  fitRequest,
  sidebarVisible,
  onToggleSidebar,
  onFitAll,
  loading,
}) {
  const markerIcon = useMemo(() => L.divIcon({
    className: "partner-marker-icon",
    html: "<span></span>",
    iconSize: [24, 30],
    iconAnchor: [12, 29],
    popupAnchor: [0, -27],
  }), []);

  return (
    <section className="map-panel" aria-label="Bản đồ đối tác">
      <MapContainer center={DEFAULT_CENTER} zoom={4} minZoom={2} maxZoom={18} zoomControl={false} worldCopyJump className="leaflet-map">
        <TileLayer url={env.mapTileUrl} attribution={env.mapAttribution} maxNativeZoom={19} />
        <ZoomControl position="topleft" />
        <MapController points={points} selectedPartner={selectedPartner} fitRequest={fitRequest} sidebarVisible={sidebarVisible} />
        {mapLayers.density && <HeatmapLayer points={points} radius={radius} intensity={intensity} />}
        {mapLayers.points && (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            zoomToBoundsOnClick
            iconCreateFunction={createClusterIcon}
          >
            {points.map((partner) => (
              <PartnerMarker key={partner.id} partner={partner} icon={markerIcon} selected={selectedPartner?.id === partner.id} onSelect={onSelectPartner} />
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      <div className="map-actions">
        <button type="button" onClick={onToggleSidebar}>{sidebarVisible ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</button>
        <button type="button" onClick={onFitAll}>◎ Toàn bộ điểm</button>
      </div>
      {loading && <div className="map-state-overlay">Đang cập nhật bản đồ…</div>}
      {!loading && !points.length && <div className="map-state-overlay">Không có điểm hợp lệ cho bộ lọc hiện tại.</div>}
      <div className="legend">{mapLayers.points && <div><span className="legend-dot" /> Đối tác</div>}{mapLayers.density && <><div className="legend-gradient" /><span>Thưa</span><span>→</span><span>Dày</span></>}</div>
      <div className="map-footer"><span><i className="green-dot" />Mock từ SQL seed • chưa kết nối Backend</span><span>{points.length} điểm hợp lệ</span></div>
    </section>
  );
}
