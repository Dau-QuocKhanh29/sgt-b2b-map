import { useState } from "react";
import { isMapped } from "../utils/partnerFilters.js";

const PAGE_SIZE = 24;

export default function PartnerList({ partners, selectedId, onSelect, onUnmappedSelect }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (!partners.length) {
    return <div className="empty-list">Không có đối tác phù hợp.<br />Hãy thử xóa bớt bộ lọc.</div>;
  }

  return (
    <>
      <div className="partner-list">
        {partners.slice(0, visibleCount).map((partner) => (
          <button
            type="button"
            key={partner.id}
            className={`partner-item ${selectedId === partner.id ? "active" : ""}`}
            onClick={() => isMapped(partner) ? onSelect(partner) : onUnmappedSelect(partner)}
          >
            <strong>{partner.name}</strong>
            <p>{partner.address || "Chưa có địa chỉ"} · {partner.country || "Chưa xác định"}</p>
            <span className="tags">
              <span className="tag">{partner.relationshipStatus}</span>
              <span className="tag">{partner.industries[0] || "Chưa phân loại"}</span>
              {!isMapped(partner) && <span className="tag location-missing">Chưa định vị</span>}
            </span>
          </button>
        ))}
      </div>
      {visibleCount < partners.length && (
        <button type="button" className="load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          Xem thêm {Math.min(PAGE_SIZE, partners.length - visibleCount)} đối tác
        </button>
      )}
    </>
  );
}
