import { useState, useMemo } from "react";
import { PieChart } from "lucide-react";
import { SANS, SERIF } from "../lib/constants";
import { expenseInDefault, currencySymbol } from "../lib/currency";
import Icon from "./Icon";
import { EmptyState } from "./HomeScreen";

function BudgetEditorRow({ colors, category, spent, budget, onSave, symbol }) {
  const [value, setValue] = useState(budget ? String(budget) : "");
  const [editing, setEditing] = useState(false);

  const handleBlur = () => {
    setEditing(false);
    const num = Math.max(0, Number(value) || 0);
    if (num !== budget) onSave(num);
  };

  return (
    <div style={{ background: colors.surface, borderRadius: 12, border: `0.5px solid ${colors.border}`, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: budget > 0 ? 10 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={category.icon} size={15} color={colors.inkSoft} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: colors.ink, fontFamily: SANS }}>{category.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14, color: colors.inkSoft, fontFamily: SERIF }}>{symbol}</span>
          <input
            type="number" min="0" placeholder="0" value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setEditing(true)} onBlur={handleBlur}
            style={{
              width: 80, border: "none", borderBottom: `1px solid ${editing ? colors.teal : "transparent"}`,
              background: "none", fontSize: 16, fontFamily: SERIF, textAlign: "right", padding: "2px 0",
              outline: "none", color: colors.ink,
            }}
          />
        </div>
      </div>
      {budget > 0 && (
        <div style={{ height: 6, background: colors.sand, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (spent / budget) * 100)}%`, background: spent > budget ? colors.brick : colors.teal, transition: "width 0.3s ease" }} />
        </div>
      )}
    </div>
  );
}

export default function BudgetsScreen({ colors, monthExpenses, budgets, categories, onSaveBudget, defaultCurrency = "USD" }) {
  const symbol = currencySymbol(defaultCurrency);
  const categoryTotals = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + expenseInDefault(e, defaultCurrency); });
    return map;
  }, [monthExpenses, defaultCurrency]);

  return (
    <div style={{ padding: "8px 18px" }}>
      <p style={{ fontSize: 12.5, color: colors.inkFaint, margin: 0, fontFamily: SANS, textTransform: "uppercase", letterSpacing: 0.5 }}>Monthly limits</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: "2px 0 20px", color: colors.ink, fontFamily: SERIF }}>Budgets</p>

      {categories.length === 0 ? (
        <EmptyState colors={colors} icon={<PieChart size={22} color={colors.inkFaint} />} title="No categories yet" body="Add categories in Settings before setting budget limits." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {categories.map((cat) => (
            <BudgetEditorRow key={cat.id} colors={colors} category={cat} spent={categoryTotals[cat.id] || 0} budget={budgets[cat.id] || 0} onSave={(amount) => onSaveBudget(cat.id, amount)} symbol={symbol} />
          ))}
        </div>
      )}
    </div>
  );
}
