export const DEFAULT_FILTERS = Object.freeze({
  search: "",
  countries: [],
  regions: [],
  districts: [],
  salespersons: [],
  industries: [],
  tags: [],
  sources: [],
  relationshipStatuses: [],
  geocodeStatuses: [],
});

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .trim();
}

function intersects(selected, values) {
  if (!selected?.length) return true;
  const candidates = Array.isArray(values) ? values : [values];
  return selected.some((selectedValue) => candidates.includes(selectedValue));
}

export function isMapped(partner) {
  return partner.geocodeStatus === "VALID"
    && Number.isFinite(partner.latitude)
    && Number.isFinite(partner.longitude)
    && partner.latitude >= -90
    && partner.latitude <= 90
    && partner.longitude >= -180
    && partner.longitude <= 180;
}

export function deduplicatePartners(partners) {
  return [...new Map(partners.map((partner) => [partner.id, partner])).values()];
}

export function filterPartners(partners, filters = DEFAULT_FILTERS) {
  const query = normalize(filters.search);
  return deduplicatePartners(partners).filter((partner) => {
    const searchable = normalize([
      partner.name,
      partner.address,
      partner.country,
      partner.region,
      partner.district,
      ...(partner.industries || []),
      ...(partner.tags || []),
    ].filter(Boolean).join(" "));

    return (!query || searchable.includes(query))
      && intersects(filters.countries, partner.country)
      && intersects(filters.regions, partner.region)
      && intersects(filters.districts, partner.district)
      && intersects(filters.salespersons, partner.salesperson)
      && intersects(filters.industries, partner.industries)
      && intersects(filters.tags, partner.tags)
      && intersects(filters.sources, partner.source)
      && intersects(filters.relationshipStatuses, partner.relationshipStatus)
      && intersects(filters.geocodeStatuses, isMapped(partner) ? "VALID" : "UNMAPPED");
  });
}

export function summarizePartners(partners) {
  const uniquePartners = deduplicatePartners(partners);
  const totalMapped = uniquePartners.filter(isMapped).length;
  return {
    totalMatched: uniquePartners.length,
    totalMapped,
    totalUnmapped: uniquePartners.length - totalMapped,
  };
}

export function buildFilterOptions(partners) {
  const unique = (selector) => [...new Set(partners.flatMap(selector).filter(Boolean))]
    .sort((left, right) => String(left).localeCompare(String(right), "vi"));
  const regionsByCountry = {};
  const districtsByRegion = {};
  partners.forEach((partner) => {
    if (partner.country && partner.region) {
      regionsByCountry[partner.country] = [...new Set([...(regionsByCountry[partner.country] || []), partner.region])]
        .sort((left, right) => left.localeCompare(right, "vi"));
    }
    if (partner.region && partner.district) {
      districtsByRegion[partner.region] = [...new Set([...(districtsByRegion[partner.region] || []), partner.district])]
        .sort((left, right) => left.localeCompare(right, "vi"));
    }
  });
  return {
    countries: unique((partner) => [partner.country]),
    regions: unique((partner) => [partner.region]),
    districts: unique((partner) => [partner.district]),
    salespersons: unique((partner) => [partner.salesperson]),
    industries: unique((partner) => partner.industries || []),
    tags: unique((partner) => partner.tags || []),
    sources: unique((partner) => [partner.source]),
    relationshipStatuses: ["LEAD", "PROSPECT", "PARTNER"],
    regionsByCountry,
    districtsByRegion,
  };
}
