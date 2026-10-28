import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";

export default function PartnerMarker({ partner, icon, selected, onSelect }) {
  const markerRef = useRef(null);
  useEffect(() => {
    if (selected) markerRef.current?.openPopup();
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={[partner.latitude, partner.longitude]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(partner) }}
    >
      <Popup minWidth={245}>
        <article className="leaflet-partner-popup">
          <strong>{partner.name}</strong>
          <p>{partner.address || "Chưa có địa chỉ"}<br />{partner.region}, {partner.country}</p>
          <div className="popup-meta">
            <span>{partner.relationshipStatus}</span>
            <span>{partner.industries[0] || "Chưa phân loại"}</span>
            <span>{partner.salesperson || "Chưa phân công"}</span>
            <span>{partner.source || "Chưa có nguồn"}</span>
          </div>
          <div className="popup-tags">{partner.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>
      </Popup>
    </Marker>
  );
}
