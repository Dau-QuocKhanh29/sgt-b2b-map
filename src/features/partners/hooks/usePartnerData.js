import { useEffect, useRef, useState } from "react";
import { partnerService } from "../services/partnerService.js";

const EMPTY_SUMMARY = { totalMatched: 0, totalMapped: 0, totalUnmapped: 0 };

export default function usePartnerData(filters, refreshToken = 0) {
  const [state, setState] = useState({
    partners: [],
    mapPoints: [],
    summary: EMPTY_SUMMARY,
    filterOptions: null,
    loading: true,
    error: "",
  });
  const requestSequence = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestSequence.current;
    queueMicrotask(() => {
      if (controller.signal.aborted || requestSequence.current !== requestId) return;
      setState((current) => ({
        ...current,
        partners: [],
        mapPoints: [],
        summary: EMPTY_SUMMARY,
        loading: true,
        error: "",
      }));
    });

    Promise.all([
      partnerService.getPartners(filters, { signal: controller.signal }),
      partnerService.getMapPoints(filters, { signal: controller.signal }),
      partnerService.getMapSummary(filters, { signal: controller.signal }),
      partnerService.getFilterOptions({ signal: controller.signal }),
    ]).then(([partnerResult, mapPoints, summary, filterOptions]) => {
      if (requestSequence.current !== requestId) return;
      setState({
        partners: partnerResult.items,
        mapPoints,
        summary,
        filterOptions,
        loading: false,
        error: "",
      });
    }).catch((error) => {
      if (error.name === "AbortError" || requestSequence.current !== requestId) return;
      setState((current) => ({ ...current, loading: false, error: error.message || "Không thể tải dữ liệu." }));
    });

    return () => controller.abort();
  }, [filters, refreshToken]);

  return state;
}
