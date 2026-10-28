import { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Header.jsx";
import useDebouncedValue from "../../../hooks/useDebouncedValue.js";
import Sidebar from "../../partners/components/Sidebar.jsx";
import usePartnerData from "../../partners/hooks/usePartnerData.js";
import { DEFAULT_FILTERS, isMapped } from "../../partners/utils/partnerFilters.js";
import PartnerMap from "../components/PartnerMap.jsx";

function newFilters() {
  return Object.fromEntries(Object.entries(DEFAULT_FILTERS).map(([key, value]) => [key, Array.isArray(value) ? [] : value]));
}

export default function MapPage() {
  const [filters, setFilters] = useState(newFilters);
  const debouncedSearch = useDebouncedValue(filters.search, 250);
  const effectiveFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);
  const [mapLayers, setMapLayers] = useState({ points: true, density: false });
  const [radius, setRadius] = useState(26);
  const [intensity, setIntensity] = useState(1.4);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [fitRequest, setFitRequest] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);
  const [toast, setToast] = useState("");
  const data = usePartnerData(effectiveFilters, refreshToken);

  const activeSelectedPartner = selectedPartner && data.partners.some((partner) => partner.id === selectedPartner.id)
    ? selectedPartner
    : null;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function selectPartner(partner) {
    if (!isMapped(partner)) {
      setToast(`${partner.name} chưa có tọa độ hợp lệ để định vị.`);
      return;
    }
    setMapLayers((layers) => ({ ...layers, points: true }));
    setSelectedPartner(partner);
  }

  function toggleMapLayer(layer) {
    setMapLayers((current) => {
      const next = { ...current, [layer]: !current[layer] };
      return next.points || next.density ? next : current;
    });
    setSelectedPartner(null);
  }

  function resetFilters() {
    setFilters(newFilters());
    setSelectedPartner(null);
    setToast("Đã xóa toàn bộ bộ lọc.");
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="workspace">
        <Sidebar
          visible={sidebarVisible}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          mapLayers={mapLayers}
          onToggleLayer={toggleMapLayer}
          radius={radius}
          intensity={intensity}
          onRadiusChange={setRadius}
          onIntensityChange={setIntensity}
          filterOptions={data.filterOptions}
          summary={data.summary}
          partners={data.partners}
          selectedId={activeSelectedPartner?.id}
          onSelectPartner={selectPartner}
          onUnmappedSelect={selectPartner}
          loading={data.loading}
          error={data.error}
          onRetry={() => setRefreshToken((value) => value + 1)}
        />
        <PartnerMap
          points={data.mapPoints}
          mapLayers={mapLayers}
          radius={radius}
          intensity={intensity}
          selectedPartner={activeSelectedPartner}
          onSelectPartner={selectPartner}
          fitRequest={fitRequest}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((visible) => !visible)}
          onFitAll={() => setFitRequest((value) => value + 1)}
          loading={data.loading}
        />
      </div>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
