import { Home, History, Plus, PieChart, Settings } from "lucide-react";
import { SANS } from "../lib/constants";

export default function BottomNav({ colors, tab, setTab, onAdd }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "history", label: "History", icon: History },
    { id: "add", label: "Add", icon: Plus, isAction: true },
    { id: "budgets", label: "Budgets", icon: PieChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 420, height: 68,
      background: colors.surface, borderTop: `0.5px solid ${colors.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px",
      zIndex: 50,
    }}>
      {items.map((item) => {
        const ItemIcon = item.icon;
        if (item.isAction) {
          return (
            <button key={item.id} onClick={onAdd} style={{ width: 44, height: 44, borderRadius: "50%", background: colors.teal, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -22, boxShadow: "0 2px 8px rgba(15,110,86,0.35)" }} aria-label="Add expense">
              <ItemIcon size={20} color="#fff" strokeWidth={2.5} />
            </button>
          );
        }
        const active = tab === item.id;
        return (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", color: active ? colors.teal : colors.inkFaint }}>
            <ItemIcon size={19} strokeWidth={active ? 2.3 : 1.8} />
            <span style={{ fontSize: 10.5, fontFamily: SANS }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
