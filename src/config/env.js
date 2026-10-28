export const env = Object.freeze({
  dataSource: import.meta.env.VITE_DATA_SOURCE || "api",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || "",
  demoModeEnabled: import.meta.env.VITE_ENABLE_DEMO_MODE === "true",
  mapTileUrl:
    import.meta.env.VITE_MAP_TILE_URL || "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  mapAttribution:
    import.meta.env.VITE_MAP_ATTRIBUTION || "Tiles &copy; Esri &mdash; Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan",
});
