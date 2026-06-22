import { X, Check, Plus } from "lucide-react";
import { THEMES, SANS } from "../lib/constants";
import { sharedBtn, sharedModal } from "../lib/styles";
import Icon from "./Icon";

export default function SpaceSwitcherSheet({ colors, spacesIndex, activeId, onSelect, onNew, onClose }) {
  return (
    <div style={sharedModal(colors).backdrop} onClick={onClose}>
      <div style={sharedModal(colors).sheet} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SANS }}>Switch space</p>
          <button onClick={onClose} style={sharedBtn(colors).icon} aria-label="Close"><X size={18} color={colors.inkSoft} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {spacesIndex.map((s) => {
            const themeDef = THEMES[s.themeId] || THEMES.custom;
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                  background: active ? colors.tealSoft : "transparent",
                  border: active ? `1px solid ${colors.teal}` : "0.5px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon name={s.icon || themeDef.icon} size={16} color={active ? colors.teal : colors.inkSoft} />
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? colors.teal : colors.ink, fontFamily: SANS }}>{s.name}</span>
                </div>
                {active && <Check size={15} color={colors.teal} />}
              </button>
            );
          })}
        </div>
        <button
          onClick={onNew}
          style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "11px 12px",
            borderRadius: 10, cursor: "pointer", background: "none", border: `1px dashed ${colors.border}`,
            color: colors.teal, fontFamily: SANS, fontSize: 14, fontWeight: 500,
          }}
        >
          <Plus size={16} />
          New space
        </button>
      </div>
    </div>
  );
}
