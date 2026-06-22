import { useState, useCallback, useMemo } from "react";
import { Check } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { THEMES, SANS } from "../lib/constants";
import { uid, monthKey, todayISO } from "../lib/utils";
import { useStorageValue } from "../hooks/useStorage";
import { spaceDataKey } from "../lib/constants";
import { sharedToast } from "../lib/styles";
import Icon from "./Icon";
import HomeScreen from "./HomeScreen";
import HistoryScreen from "./HistoryScreen";
import BudgetsScreen from "./BudgetsScreen";
import SettingsScreen from "./SettingsScreen";
import ExpenseEditor from "./ExpenseEditor";
import SpaceSwitcherSheet from "./SpaceSwitcherSheet";
import BottomNav from "./BottomNav";

function TopBar({ colors, space, themeDef, onTap }) {
  return (
    <div style={{ padding: "14px 18px 6px" }}>
      <button
        onClick={onTap}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 12px", background: colors.sand, border: "none", borderRadius: 10, cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name={space.icon || themeDef.icon} size={16} color={colors.inkSoft} />
          <span style={{ fontSize: 14, fontWeight: 500, color: colors.ink, fontFamily: SANS }}>{space.name}</span>
        </div>
        <ChevronDown size={16} color={colors.inkSoft} />
      </button>
    </div>
  );
}

export default function SpaceShell({ colors, mode, toggleMode, space, spacesIndex, onSwitchSpace, onNewSpace, onRenameSpace, onDeleteSpace, onUpdateSpace, showSwitcher, setShowSwitcher }) {
  const [categories, setCategories] = useStorageValue(spaceDataKey(space.id, "categories"), []);
  const [members, setMembers] = useStorageValue(spaceDataKey(space.id, "members"), []);
  const [expenses, setExpenses] = useStorageValue(spaceDataKey(space.id, "expenses"), []);
  const [budgets, setBudgets] = useStorageValue(spaceDataKey(space.id, "budgets"), {});

  const [tab, setTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const currentMonth = monthKey(todayISO());
  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === currentMonth),
    [expenses, currentMonth]
  );

  const addExpense = useCallback((expense) => {
    setExpenses([{ ...expense, id: uid() }, ...expenses]);
    showToast("Expense saved");
  }, [expenses, setExpenses, showToast]);

  const updateExpense = useCallback((id, patch) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    showToast("Expense updated");
  }, [expenses, setExpenses, showToast]);

  const deleteExpense = useCallback((id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    showToast("Expense deleted");
  }, [expenses, setExpenses, showToast]);

  const saveBudget = useCallback((categoryId, amount) => {
    setBudgets({ ...budgets, [categoryId]: amount });
  }, [budgets, setBudgets]);

  const themeDef = THEMES[space.themeId] || THEMES.custom;

  return (
    <div style={{ position: "relative" }}>
      <TopBar colors={colors} space={space} themeDef={themeDef} onTap={() => setShowSwitcher(true)} />

      <div style={{ paddingBottom: 76 }}>
        {tab === "home" && (
          <HomeScreen
            colors={colors} space={space} expenses={expenses} monthExpenses={monthExpenses} budgets={budgets}
            members={members} categories={categories} currentMonth={currentMonth}
            onAdd={() => setShowAdd(true)} onSelectExpense={(e) => setEditingExpense(e)}
          />
        )}
        {tab === "history" && (
          <HistoryScreen colors={colors} expenses={expenses} members={members} categories={categories} onSelectExpense={(e) => setEditingExpense(e)} defaultCurrency={space.defaultCurrency || "USD"} />
        )}
        {tab === "budgets" && (
          <BudgetsScreen colors={colors} monthExpenses={monthExpenses} budgets={budgets} categories={categories} onSaveBudget={saveBudget} defaultCurrency={space.defaultCurrency || "USD"} />
        )}
        {tab === "settings" && (
          <SettingsScreen
            colors={colors} mode={mode} toggleMode={toggleMode}
            space={space} members={members} categories={categories}
            onSaveMembers={setMembers} onSaveCategories={setCategories}
            onRenameSpace={onRenameSpace} onDeleteSpace={onDeleteSpace}
            onOpenSwitcher={() => setShowSwitcher(true)}
            onUpdateSpace={onUpdateSpace}
          />
        )}
      </div>

      <BottomNav colors={colors} tab={tab} setTab={setTab} onAdd={() => setShowAdd(true)} />

      {showAdd && (
        <ExpenseEditor
          colors={colors} members={members} categories={categories} space={space}
          onClose={() => setShowAdd(false)}
          onSave={(exp) => { addExpense(exp); setShowAdd(false); }}
        />
      )}

      {editingExpense && (
        <ExpenseEditor
          colors={colors} members={members} categories={categories} space={space} initial={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(exp) => { updateExpense(editingExpense.id, exp); setEditingExpense(null); }}
          onDelete={() => { deleteExpense(editingExpense.id); setEditingExpense(null); }}
        />
      )}

      {showSwitcher && (
        <SpaceSwitcherSheet
          colors={colors} spacesIndex={spacesIndex} activeId={space.id}
          onSelect={(id) => { onSwitchSpace(id); setShowSwitcher(false); }}
          onNew={() => { setShowSwitcher(false); onNewSpace(); }}
          onClose={() => setShowSwitcher(false)}
        />
      )}

      {toast && (
        <div style={sharedToast(colors)} role="status">
          <Check size={15} color={colors.teal} strokeWidth={2.5} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
