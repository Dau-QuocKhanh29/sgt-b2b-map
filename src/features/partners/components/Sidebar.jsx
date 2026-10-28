import MultiSelect from "./MultiSelect.jsx";
import PartnerList from "./PartnerList.jsx";
import SummaryCards from "./SummaryCards.jsx";

function toSingleArray(value) {
  return value ? [value] : [];
}

export default function Sidebar({
  visible,
  filters,
  onFiltersChange,
  onReset,
  mapLayers,
  onToggleLayer,
  radius,
  intensity,
  onRadiusChange,
  onIntensityChange,
  filterOptions,
  summary,
  partners,
  selectedId,
  onSelectPartner,
  onUnmappedSelect,
  loading,
  error,
  onRetry,
}) {
  const options = filterOptions || {
    countries: [], regions: [], districts: [], salespersons: [], industries: [], tags: [], sources: [], relationshipStatuses: [],
  };
  const selectedCountry = filters.countries[0] || "";
  const selectedRegion = filters.regions[0] || "";
  const regionOptions = options.regionsByCountry?.[selectedCountry] || options.regions;
  const districtOptions = options.districtsByRegion?.[selectedRegion] || options.districts;

  function setFilter(key, value) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function setLocationFilter(key, value) {
    const next = { ...filters, [key]: toSingleArray(value) };
    if (key === "countries") { next.regions = []; next.districts = []; }
    if (key === "regions") next.districts = [];
    onFiltersChange(next);
  }

  return (
    <aside className={`sidebar ${visible ? "" : "is-hidden"}`}>
      <div className="sidebar-head">
        <div className="mini-brand"><span className="mini-logo">S</span><div><span className="eyebrow">SGT WEB APPS</span><h1>B2B Map</h1><p>CRM / Partner Network</p></div></div>
        <button type="button" className="icon-button" onClick={onReset} aria-label="Xóa bộ lọc" title="Xóa bộ lọc">↻</button>
      </div>

      <section className="control-card">
        <div className="section-title-row"><h2><span className="status-dot" /> Khách hàng</h2><span className="live-label">MOCK TỪ SQL SEED</span></div>
        <div className="mode-switch" role="group" aria-label="Lớp bản đồ">
          <button type="button" aria-pressed={mapLayers.points} className={`mode-button ${mapLayers.points ? "active" : ""}`} onClick={() => onToggleLayer("points")}>Điểm</button>
          <button type="button" aria-pressed={mapLayers.density} className={`mode-button ${mapLayers.density ? "active" : ""}`} onClick={() => onToggleLayer("density")}>Mật độ</button>
        </div>
        <p className="helper">Có thể bật đồng thời marker/cluster và heatmap trên cùng dữ liệu lọc.</p>
        {mapLayers.density && (
          <div className="density-controls">
            <label className="range-label" htmlFor="radiusRange"><span>Bán kính vùng nhiệt</span><output>{radius} px</output></label>
            <input id="radiusRange" type="range" min="12" max="50" value={radius} onChange={(event) => onRadiusChange(Number(event.target.value))} />
            <label className="range-label" htmlFor="intensityRange"><span>Cường độ</span><output>{intensity.toFixed(1)}×</output></label>
            <input id="intensityRange" type="range" min="5" max="25" value={Math.round(intensity * 10)} onChange={(event) => onIntensityChange(Number(event.target.value) / 10)} />
          </div>
        )}
      </section>

      <div className="field-group">
        <label htmlFor="searchInput">Tìm đối tác / ngành hàng / tags</label>
        <div className="search-wrap"><span>⌕</span><input id="searchInput" type="search" placeholder="Nhập từ khóa..." value={filters.search} onChange={(event) => setFilter("search", event.target.value)} /></div>
      </div>

      <div className="filter-heading">BỘ LỌC CRM</div>
      <div className="field-group"><label htmlFor="countryFilter">Quốc gia</label><select id="countryFilter" value={selectedCountry} onChange={(event) => setLocationFilter("countries", event.target.value)}><option value="">Tất cả quốc gia</option>{options.countries.map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="two-columns">
        <div className="field-group"><label htmlFor="regionFilter">Tỉnh / Thành</label><select id="regionFilter" value={selectedRegion} onChange={(event) => setLocationFilter("regions", event.target.value)}><option value="">Tất cả</option>{regionOptions.map((value) => <option key={value}>{value}</option>)}</select></div>
        <div className="field-group"><label htmlFor="districtFilter">Quận / Huyện</label><select id="districtFilter" value={filters.districts[0] || ""} onChange={(event) => setLocationFilter("districts", event.target.value)}><option value="">Tất cả</option>{districtOptions.map((value) => <option key={value}>{value}</option>)}</select></div>
      </div>
      <div className="field-group"><label htmlFor="salesFilter">Salesperson</label><select id="salesFilter" value={filters.salespersons[0] || ""} onChange={(event) => setFilter("salespersons", toSingleArray(event.target.value))}><option value="">Tất cả nhân sự</option>{options.salespersons.map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="field-group"><label>Industries</label><MultiSelect label="Tất cả ngành hàng" values={options.industries} selected={filters.industries} onChange={(value) => setFilter("industries", value)} /></div>
      <div className="field-group"><label>Tags</label><MultiSelect label="Tất cả tags" values={options.tags} selected={filters.tags} onChange={(value) => setFilter("tags", value)} /></div>
      <div className="field-group"><label htmlFor="sourceFilter">Nguồn tạo</label><select id="sourceFilter" value={filters.sources[0] || ""} onChange={(event) => setFilter("sources", toSingleArray(event.target.value))}><option value="">Tất cả nguồn</option>{options.sources.map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="field-group"><label htmlFor="relationshipFilter">Loại hồ sơ</label><select id="relationshipFilter" value={filters.relationshipStatuses[0] || ""} onChange={(event) => setFilter("relationshipStatuses", toSingleArray(event.target.value))}><option value="">Tất cả loại</option>{options.relationshipStatuses.map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="field-group"><label htmlFor="geoFilter">Trạng thái tọa độ</label><select id="geoFilter" value={filters.geocodeStatuses[0] || ""} onChange={(event) => setFilter("geocodeStatuses", toSingleArray(event.target.value))}><option value="">Tất cả</option><option value="VALID">Có vị trí</option><option value="UNMAPPED">Chưa xác định</option></select></div>

      <SummaryCards summary={summary} />
      <section className="partner-section">
        <div className="partner-section-head"><h2>Danh sách đối tác</h2><span>{summary.totalMatched} bản ghi</span></div>
        {loading && <div className="state-message">Đang tải dữ liệu…</div>}
        {error && <div className="state-message error">{error}<button type="button" onClick={onRetry}>Thử lại</button></div>}
        {!loading && !error && <PartnerList partners={partners} selectedId={selectedId} onSelect={onSelectPartner} onUnmappedSelect={onUnmappedSelect} />}
      </section>
    </aside>
  );
}
