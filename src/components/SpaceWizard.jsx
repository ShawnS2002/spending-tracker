import { useState } from "react";
import { ArrowLeft, ChevronRight, Check, Plus, X } from "lucide-react";
import { THEMES, SANS, CURATED_CURRENCIES, CURRENCY_NAMES } from "../lib/constants";
import { uid } from "../lib/utils";
import { sharedBtn, sharedInput, stepHeading, stepSub } from "../lib/styles";
import Icon from "./Icon";

export default function SpaceWizard({ colors, onCancel, onCreate }) {
  const [step, setStep] = useState(0);
  const [themeId, setThemeId] = useState(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencyQuery, setCurrencyQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [customCatName, setCustomCatName] = useState("");
  const [customCats, setCustomCats] = useState([]);

  const themeDef = themeId ? THEMES[themeId] : null;

  const chooseTheme = (id) => {
    setThemeId(id);
    setSelectedCats(THEMES[id].defaultSelected);
    setCustomCats([]);
    if (!name) setName(THEMES[id].label);
    setStep(1);
  };

  const toggleCat = (id) => {
    setSelectedCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const addCustomCat = () => {
    const n = customCatName.trim();
    if (!n) return;
    const id = "custom_" + uid();
    setCustomCats((prev) => [...prev, { id, name: n, icon: "Tag" }]);
    setSelectedCats((prev) => [...prev, id]);
    setCustomCatName("");
  };

  const removeCustomCat = (id) => {
    setCustomCats((prev) => prev.filter((c) => c.id !== id));
    setSelectedCats((prev) => prev.filter((c) => c !== id));
  };

  const finish = () => {
    const pool = [...themeDef.categoryPool, ...customCats];
    const categories = pool.filter((c) => selectedCats.includes(c.id));
    onCreate({
      name: name.trim() || themeDef.label,
      themeId: themeDef.id,
      icon: themeDef.icon,
      categories,
      defaultCurrency: currency,
    });
  };

  const stepLabels = ["Theme", "Name", "Currency", "Categories"];

  return (
    <div style={{ padding: "16px 18px 24px", minHeight: "100dvh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
          style={sharedBtn(colors).icon}
          aria-label="Back"
        >
          <ArrowLeft size={18} color={colors.inkSoft} />
        </button>
        <div style={{ display: "flex", gap: 6, flex: 1 }}>
          {stepLabels.map((lbl, i) => (
            <div key={lbl} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: i <= step ? colors.teal : colors.border }} />
            </div>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <p style={stepHeading(colors)}>What kind of space is this?</p>
          <p style={stepSub(colors)}>Pick a theme to get sensible category suggestions. You can change everything later.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => chooseTheme(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 14px",
                  borderRadius: 12, border: `0.5px solid ${colors.border}`, background: colors.surface,
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: colors.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={t.icon} size={18} color={colors.teal} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SANS }}>{t.label}</p>
                  <p style={{ fontSize: 12.5, margin: "2px 0 0", color: colors.inkFaint, fontFamily: SANS }}>{t.blurb}</p>
                </div>
                <ChevronRight size={16} color={colors.inkFaint} />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && themeDef && (
        <div>
          <p style={stepHeading(colors)}>Name your space</p>
          <p style={stepSub(colors)}>Something you'll recognize at a glance.</p>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={themeDef.label}
            style={{ ...sharedInput(colors), width: "100%", fontSize: 16, padding: "12px 14px", marginTop: 16 }}
          />
          <button
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            style={{ ...sharedBtn(colors).primary, width: "100%", marginTop: 24, opacity: name.trim() ? 1 : 0.5 }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && themeDef && (
        <div>
          <p style={stepHeading(colors)}>Main currency</p>
          <p style={stepSub(colors)}>Budgets and totals are shown in this currency. You can still log individual expenses in any other currency.</p>

          <input
            type="text"
            placeholder="Search currency"
            value={currencyQuery}
            onChange={(e) => setCurrencyQuery(e.target.value)}
            style={{ ...sharedInput(colors), width: "100%", margin: "16px 0 12px" }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto", marginBottom: 22 }}>
            {CURATED_CURRENCIES.filter((code) => {
              const q = currencyQuery.trim().toLowerCase();
              if (!q) return true;
              return code.toLowerCase().includes(q) || (CURRENCY_NAMES[code] || "").toLowerCase().includes(q);
            }).map((code) => {
              const active = currency === code;
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                    background: active ? colors.tealSoft : colors.surface,
                    border: active ? `1px solid ${colors.teal}` : `0.5px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? colors.teal : colors.inkSoft, fontFamily: SANS, minWidth: 34 }}>{code}</span>
                    <span style={{ fontSize: 14, color: active ? colors.teal : colors.ink, fontFamily: SANS }}>{CURRENCY_NAMES[code]}</span>
                  </div>
                  {active && <Check size={15} color={colors.teal} />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(3)}
            style={{ ...sharedBtn(colors).primary, width: "100%" }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && themeDef && (
        <div>
          <p style={stepHeading(colors)}>Choose categories</p>
          <p style={stepSub(colors)}>Tap to add or remove. Add your own at the bottom.</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, marginBottom: 18 }}>
            {themeDef.categoryPool.map((cat) => {
              const active = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                    borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: SANS,
                    background: active ? colors.tealSoft : "transparent",
                    border: active ? `1px solid ${colors.teal}` : `0.5px solid ${colors.border}`,
                    color: active ? colors.teal : colors.inkSoft,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <Icon name={cat.icon} size={14} />
                  {cat.name}
                  {active && <Check size={12} />}
                </button>
              );
            })}
            {customCats.map((cat) => {
              const active = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                    borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: SANS,
                    background: active ? colors.tealSoft : "transparent",
                    border: active ? `1px solid ${colors.teal}` : `0.5px solid ${colors.border}`,
                    color: active ? colors.teal : colors.inkSoft,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <Icon name="Tag" size={14} />
                  {cat.name}
                  <span onClick={(e) => { e.stopPropagation(); removeCustomCat(cat.id); }} style={{ display: "flex" }}>
                    <X size={12} />
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            <input
              type="text"
              placeholder="Add a custom category"
              value={customCatName}
              onChange={(e) => setCustomCatName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCustomCat(); }}
              style={{ ...sharedInput(colors), flex: 1 }}
            />
            <button onClick={addCustomCat} style={sharedBtn(colors).secondarySm}>
              <Plus size={15} /> Add
            </button>
          </div>

          <button
            onClick={finish}
            disabled={selectedCats.length === 0}
            style={{ ...sharedBtn(colors).primary, width: "100%", opacity: selectedCats.length ? 1 : 0.5 }}
          >
            Create space
          </button>
        </div>
      )}
    </div>
  );
}
