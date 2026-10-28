import { env } from "../../../config/env.js";
import apiClient from "../../../config/apiClient.js";
import { authService } from "../../auth/services/authService.js";
import mockPartners from "../data/mockPartners.json";
import {
  buildFilterOptions,
  filterPartners,
  isMapped,
  summarizePartners,
} from "../utils/partnerFilters.js";

const MOCK_DELAY_MS = 120;

function wait(signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, MOCK_DELAY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Request aborted", "AbortError"));
    }, { once: true });
  });
}

function toApiParams(filters) {
  return {
    q: filters.search || undefined,
    country: filters.countries,
    admin1: filters.regions,
    admin2: filters.districts,
    salesperson: filters.salespersons,
    industry: filters.industries,
    tag: filters.tags,
    source: filters.sources,
    relationshipStatus: filters.relationshipStatuses,
    geocodeStatus: filters.geocodeStatuses,
  };
}

const mockDataSource = {
  async getPartners(filters, { signal } = {}) {
    await wait(signal);
    const items = filterPartners(mockPartners, filters);
    return { items, total: items.length };
  },
  async getPartnerById(id, { signal } = {}) {
    await wait(signal);
    return mockPartners.find((partner) => partner.id === Number(id)) || null;
  },
  async getMapPoints(filters, { signal } = {}) {
    await wait(signal);
    return filterPartners(mockPartners, filters).filter(isMapped);
  },
  async getMapSummary(filters, { signal } = {}) {
    await wait(signal);
    return summarizePartners(filterPartners(mockPartners, filters));
  },
  async getFilterOptions({ signal } = {}) {
    await wait(signal);
    return buildFilterOptions(mockPartners);
  },
};

const apiDataSource = {
  async getPartners(filters, { signal } = {}) {
    const { data } = await apiClient.get("/partners", { params: toApiParams(filters), signal });
    return data;
  },
  async getPartnerById(id, { signal } = {}) {
    const { data } = await apiClient.get(`/partners/${id}`, { signal });
    return data;
  },
  async getMapPoints(filters, { signal } = {}) {
    const { data } = await apiClient.get("/map/points", { params: toApiParams(filters), signal });
    return data.items || data;
  },
  async getMapSummary(filters, { signal } = {}) {
    const { data } = await apiClient.get("/map/summary", { params: toApiParams(filters), signal });
    return data;
  },
  async getFilterOptions({ signal } = {}) {
    const { data } = await apiClient.get("/map/filters", { signal });
    return data;
  },
};

function activeDataSource() {
  if (authService.isDemoSession()) return mockDataSource;
  return env.dataSource === "mock" ? mockDataSource : apiDataSource;
}

export const partnerService = {
  getPartners: (...args) => activeDataSource().getPartners(...args),
  getPartnerById: (...args) => activeDataSource().getPartnerById(...args),
  getMapPoints: (...args) => activeDataSource().getMapPoints(...args),
  getMapSummary: (...args) => activeDataSource().getMapSummary(...args),
  getFilterOptions: (...args) => activeDataSource().getFilterOptions(...args),
};
