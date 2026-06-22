import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { SANS, SERIF } from "../lib/constants";
import { formatMoney, formatRelativeDate } from "../lib/utils";
import Icon from "./Icon";

function buildMap(container, expenses, colors, onPinClick) {
  const coords = expenses.map((e) => [e.locationCoords.lat, e.locationCoords.lng]);
  const bounds = L.latLngBounds(coords);
  const center = bounds.getCenter();

  const map = L.map(container, { zoomControl: true, attributionControl: false }).setView(center, 12);
  if (coords.length > 1) {
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  const clusterGroup = L.markerClusterGroup({
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      const size = count > 99 ? 44 : count > 9 ? 38 : 32;
      return L.divIcon({
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${colors.teal};color:#fff;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;font-family:${SANS};
          box-shadow:0 0 0 4px ${colors.teal}44;
        ">${count}</div>`,
        className: "",
        iconSize: [size, size],
      });
    },
  });

  expenses.forEach((expense) => {
    const marker = L.marker([expense.locationCoords.lat, expense.locationCoords.lng], {
      icon: L.divIcon({
        html: `<div style="
          width:28px;height:28px;border-radius:50%;
          background:${colors.teal};
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          border:2px solid #fff;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    });
    marker.on("click", () => onPinClick(expense));
    clusterGroup.addLayer(marker);
  });

  map.addLayer(clusterGroup);

  // The container often reaches its final size after this runs (flex/grid layout,
  // fullscreen transition); recompute so tiles fill it instead of rendering grey.
  setTimeout(() => map.invalidateSize(), 0);

  return map;
}

function PinInfoCard({ colors, expense, categories, onClose }) {
  const cat = categories.find((c) => c.id === expense.category) || { name: "Other", icon: "MoreHorizontal" };
  return (
    <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: colors.surface, borderRadius: 14, padding: "12px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.18)", zIndex: 500, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={cat.icon} size={18} color={colors.inkSoft} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SANS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{expense.locationName}</p>
        <p style={{ fontSize: 11.5, margin: 0, color: colors.inkFaint, fontFamily: SANS }}>{cat.name}{expense.payer ? ` · ${expense.payer}` : ""} · {formatRelativeDate(expense.date)}</p>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SERIF, flexShrink: 0 }}>${formatMoney(expense.amount)}</p>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }} aria-label="Close">
        <X size={14} color={colors.inkFaint} />
      </button>
    </div>
  );
}

function LeafletMap({ colors, expenses, categories }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    if (!containerRef.current || expenses.length === 0) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    mapRef.current = buildMap(containerRef.current, expenses, colors, setSelectedExpense);
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [expenses, colors]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {selectedExpense && (
        <PinInfoCard colors={colors} expense={selectedExpense} categories={categories} onClose={() => setSelectedExpense(null)} />
      )}
    </div>
  );
}

export default function MapCard({ colors, expenses, categories }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div
        style={{ height: 180, borderRadius: 12, overflow: "hidden", marginBottom: 24, cursor: "pointer", position: "relative" }}
        onClick={() => setFullscreen(true)}
      >
        <LeafletMap colors={colors} expenses={expenses} categories={categories} />
        <div style={{ position: "absolute", top: 8, right: 8, background: colors.surface, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontFamily: SANS, color: colors.inkSoft, zIndex: 400, pointerEvents: "none" }}>
          {expenses.length} located
        </div>
      </div>

      {fullscreen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: colors.bg }}>
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 500 }}>
            <button onClick={() => setFullscreen(false)} style={{ background: colors.surface, border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <X size={16} color={colors.ink} />
              <span style={{ fontSize: 13, fontFamily: SANS, color: colors.ink }}>Close</span>
            </button>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 500, background: colors.surface, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontFamily: SANS, color: colors.inkSoft }}>
            {expenses.length} located
          </div>
          <div style={{ width: "100%", height: "100%" }}>
            <LeafletMap colors={colors} expenses={expenses} categories={categories} />
          </div>
        </div>
      )}
    </>
  );
}
