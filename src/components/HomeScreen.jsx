import { useMemo } from "react";
import { Plus, Tag, Users } from "lucide-react";
import { SANS, SERIF } from "../lib/constants";
import { monthLabel } from "../lib/utils";
import { formatCurrency, expenseInDefault, sumInDefault } from "../lib/currency";
import { sharedBtn, sectionLabel, emptyBanner } from "../lib/styles";
import Icon from "./Icon";
import MapCard from "./MapCard";

function MetricCard({ colors, label, value, tone = "neutral" }) {
  const color = tone === "danger" ? colors.brick : tone === "good" ? colors.teal : colors.ink;
  return (
    <div style={{ background: colors.sand, borderRadius: 12, padding: "12px 14px" }}>
      <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 4px", fontFamily: SANS }}>{label}</p>
      <p style={{ fontSize: 21, fontWeight: 500, margin: 0, fontFamily: SERIF, color }}>{value}</p>
    </div>
  );
}

function BudgetBar({ colors, category, spent, budget, defaultCurrency }) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = spent > budget;
  const barColor = over ? colors.brick : pct > 85 ? colors.amber : colors.teal;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: colors.ink, fontFamily: SANS }}>
          <Icon name={category.icon} size={14} color={colors.inkSoft} />
          {category.name}
        </span>
        <span style={{ color: over ? colors.brick : colors.inkSoft, fontWeight: over ? 600 : 400, fontFamily: SANS }}>
          {formatCurrency(spent, defaultCurrency)} / {formatCurrency(budget, defaultCurrency)}
        </span>
      </div>
      <div style={{ height: 7, background: colors.sand, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

export function ExpenseRow({ colors, expense, categories, last, onClick, defaultCurrency = "USD" }) {
  const cat = categories.find((c) => c.id === expense.category) || { name: "Other", icon: "MoreHorizontal" };
  const code = expense.currency || defaultCurrency;
  const isForeign = code !== defaultCurrency;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 4px", background: "none", border: "none",
        borderBottom: last ? "none" : `0.5px solid ${colors.border}`,
        width: "100%", cursor: "pointer", textAlign: "left", borderRadius: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={cat.icon} size={16} color={colors.inkSoft} />
        </div>
        <div>
          <p style={{ fontSize: 14, margin: 0, fontWeight: 500, color: colors.ink, fontFamily: SANS }}>{expense.note || cat.name}</p>
          <p style={{ fontSize: 12, margin: 0, color: colors.inkFaint, fontFamily: SANS }}>
            {cat.name}{expense.payer ? ` · ${expense.payer}` : ""}
            {expense.locationName ? ` · 📍 ${expense.locationName}` : ""}
          </p>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SERIF }}>
          {formatCurrency(expense.amount, code)}
        </p>
        {isForeign && expense.exchangeRateAtEntry && (
          <p style={{ fontSize: 11, margin: 0, color: colors.inkFaint, fontFamily: SANS }}>
            ≈ {formatCurrency(expense.amount * expense.exchangeRateAtEntry, defaultCurrency)}
          </p>
        )}
      </div>
    </button>
  );
}

export function EmptyState({ colors, icon, title, body }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 20px", background: colors.sand, borderRadius: 12, gap: 6 }}>
      {icon}
      <p style={{ fontSize: 14, fontWeight: 600, color: colors.ink, margin: "6px 0 0", fontFamily: SANS }}>{title}</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: 0, fontFamily: SANS, maxWidth: 240 }}>{body}</p>
    </div>
  );
}

export default function HomeScreen({ colors, space, expenses, monthExpenses, budgets, members, categories, currentMonth, onAdd, onSelectExpense }) {
  const defaultCurrency = space?.defaultCurrency || "USD";
  const totalSpent = sumInDefault(monthExpenses, defaultCurrency);
  const totalBudget = Object.values(budgets).reduce((s, b) => s + (Number(b) || 0), 0);
  const remaining = totalBudget - totalSpent;

  const categoryTotals = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + expenseInDefault(e, defaultCurrency); });
    return map;
  }, [monthExpenses, defaultCurrency]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return null;
    return categories.find((c) => c.id === entries[0][0]);
  }, [categoryTotals, categories]);

  const dayOfMonth = new Date().getDate();
  const dailyAvg = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  const recent = expenses.slice(0, 6);
  const locatedExpenses = expenses.filter((e) => e.locationCoords);

  return (
    <div style={{ padding: "8px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12.5, color: colors.inkFaint, margin: 0, fontFamily: SANS, textTransform: "uppercase", letterSpacing: 0.5 }}>{monthLabel(currentMonth)}</p>
          <p style={{ fontSize: 22, fontWeight: 500, margin: "2px 0 0", color: colors.ink, fontFamily: SERIF }}>Overview</p>
        </div>
        <button onClick={onAdd} style={sharedBtn(colors).primarySm}>
          <Plus size={16} strokeWidth={2.5} />
          Add
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
        <MetricCard colors={colors} label="Spent this month" value={formatCurrency(totalSpent, defaultCurrency)} />
        <MetricCard colors={colors} label="Budget remaining" value={totalBudget > 0 ? formatCurrency(remaining, defaultCurrency) : "—"} tone={totalBudget > 0 ? (remaining < 0 ? "danger" : "good") : "neutral"} />
        <MetricCard colors={colors} label="Top category" value={topCategory ? topCategory.name : "—"} />
        <MetricCard colors={colors} label="Daily average" value={formatCurrency(dailyAvg, defaultCurrency)} />
      </div>

      {members.length === 0 && (
        <div style={{ ...emptyBanner(colors), marginBottom: 22 }}>
          <Users size={16} color={colors.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: colors.ink, margin: 0, fontFamily: SANS, lineHeight: 1.5 }}>
            No members yet. Add people in Settings so expenses can be tagged to who paid.
          </p>
        </div>
      )}

      {Object.keys(budgets).filter((k) => budgets[k] > 0).length > 0 && (
        <>
          <p style={sectionLabel(colors)}>Budgets</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            {categories.filter((c) => budgets[c.id] > 0).map((cat) => (
              <BudgetBar key={cat.id} colors={colors} category={cat} spent={categoryTotals[cat.id] || 0} budget={budgets[cat.id]} defaultCurrency={defaultCurrency} />
            ))}
          </div>
        </>
      )}

      {space.locationEnabled && locatedExpenses.length > 0 && (
        <>
          <p style={sectionLabel(colors)}>Map</p>
          <MapCard colors={colors} expenses={locatedExpenses} categories={categories} />
        </>
      )}

      <p style={sectionLabel(colors)}>Recent expenses</p>
      {recent.length === 0 ? (
        <EmptyState colors={colors} icon={<Tag size={22} color={colors.inkFaint} />} title="No expenses yet" body="Tap Add to log your first expense — it takes about ten seconds." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {recent.map((e, i) => (
            <ExpenseRow key={e.id} colors={colors} expense={e} categories={categories} last={i === recent.length - 1} onClick={() => onSelectExpense(e)} defaultCurrency={defaultCurrency} />
          ))}
        </div>
      )}
    </div>
  );
}
