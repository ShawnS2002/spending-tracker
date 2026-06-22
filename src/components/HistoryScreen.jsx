import { useState, useMemo } from "react";
import { Tag } from "lucide-react";
import { SANS, SERIF } from "../lib/constants";
import { monthKey, monthLabel } from "../lib/utils";
import { sharedSelect } from "../lib/styles";
import { ExpenseRow, EmptyState } from "./HomeScreen";

export default function HistoryScreen({ colors, expenses, members, categories, onSelectExpense, defaultCurrency = "USD" }) {
  const [filterMember, setFilterMember] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = useMemo(() => expenses.filter((e) => {
    if (filterMember !== "all" && e.payer !== filterMember) return false;
    if (filterCategory !== "all" && e.category !== filterCategory) return false;
    return true;
  }), [expenses, filterMember, filterCategory]);

  const groups = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const key = monthKey(e.date);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  return (
    <div style={{ padding: "8px 18px" }}>
      <p style={{ fontSize: 12.5, color: colors.inkFaint, margin: 0, fontFamily: SANS, textTransform: "uppercase", letterSpacing: 0.5 }}>All expenses</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: "2px 0 16px", color: colors.ink, fontFamily: SERIF }}>History</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} style={{ ...sharedSelect(colors), flex: 1 }}>
          <option value="all">Everyone</option>
          {members.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...sharedSelect(colors), flex: 1 }}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {groups.length === 0 ? (
        <EmptyState colors={colors} icon={<Tag size={22} color={colors.inkFaint} />} title="No expenses found" body="Try a different filter, or add a new expense from the home tab." />
      ) : (
        groups.map(([key, items]) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: colors.inkFaint, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.4, fontFamily: SANS }}>{monthLabel(key)}</p>
            <div>
              {items.map((e, i) => (
                <ExpenseRow key={e.id} colors={colors} expense={e} categories={categories} last={i === items.length - 1} onClick={() => onSelectExpense(e)} defaultCurrency={defaultCurrency} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
