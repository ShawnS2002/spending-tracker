import { useState, useRef } from "react";
import { X, Trash2, AlertCircle, MapPin } from "lucide-react";
import { Delete as BackspaceIcon } from "lucide-react";
import { SANS, SERIF, CURATED_CURRENCIES } from "../lib/constants";
import { todayISO } from "../lib/utils";
import { sharedBtn, sharedInput, sharedSelect, sharedModal, emptyBanner } from "../lib/styles";
import Icon from "./Icon";
import { fetchExchangeRate } from "../lib/exchangeRates";
import { NOMINATIM_URL } from "../lib/config";

function LocationField({ colors, value, onChange }) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = (q) => {
    setQuery(q);
    if (value) onChange(null);
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const select = (result) => {
    const name = result.display_name.split(",").slice(0, 2).join(",").trim();
    setQuery(name);
    setResults([]);
    onChange({ name, coords: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) } });
  };

  const clear = () => { setQuery(""); setResults([]); onChange(null); };

  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Location (optional)</p>
      <div style={{ position: "relative" }}>
        <MapPin size={14} color={colors.inkFaint} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          placeholder="Search a place"
          value={query}
          onChange={(e) => search(e.target.value)}
          style={{ ...sharedInput(colors), width: "100%", paddingLeft: 30, paddingRight: value ? 30 : 12 }}
        />
        {value && (
          <button onClick={clear} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <X size={14} color={colors.inkFaint} />
          </button>
        )}
      </div>
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: 9, zIndex: 50, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {results.map((r) => {
            const primary = r.display_name.split(",")[0];
            const secondary = r.display_name.split(",").slice(1, 3).join(",").trim();
            return (
              <button
                key={r.place_id}
                onClick={() => select(r)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", background: "none", border: "none", borderBottom: `0.5px solid ${colors.border}`, cursor: "pointer", textAlign: "left" }}
              >
                <MapPin size={14} color={colors.inkFaint} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SANS }}>{primary}</p>
                  <p style={{ fontSize: 11, margin: 0, color: colors.inkFaint, fontFamily: SANS }}>{secondary}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {loading && <p style={{ fontSize: 11, color: colors.inkFaint, margin: "4px 0 0", fontFamily: SANS }}>Searching…</p>}
      {!loading && !value && <p style={{ fontSize: 11, color: colors.inkFaint, margin: "4px 0 0", fontFamily: SANS }}>Results from OpenStreetMap / Nominatim</p>}
    </div>
  );
}

export default function ExpenseEditor({ colors, members, categories, space, initial, onClose, onSave, onDelete }) {
  const [amountStr, setAmountStr] = useState(initial ? String(initial.amount) : "0");
  const [category, setCategory] = useState(initial?.category || categories[0]?.id || "");
  const [payer, setPayer] = useState(initial?.payer || members[0] || "");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [note, setNote] = useState(initial?.note || "");
  const [location, setLocation] = useState(initial?.locationName ? { name: initial.locationName, coords: initial.locationCoords } : null);
  const [currency, setCurrency] = useState(initial?.currency || space?.defaultCurrency || "USD");
  const [saving, setSaving] = useState(false);

  const defaultCurrency = space?.defaultCurrency || "USD";
  // Option A: every curated currency is always switchable; the space default just
  // pre-selects. Include the expense's own currency in case it's outside the curated set.
  const currencyOptions = CURATED_CURRENCIES.includes(currency)
    ? CURATED_CURRENCIES
    : [currency, ...CURATED_CURRENCIES];
  const showLocationField = !!space?.locationEnabled;
  const isEdit = !!initial;

  const pressKey = (k) => {
    setAmountStr((prev) => {
      if (k === "back") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (k === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev === "0") return k;
      const decimalIdx = prev.indexOf(".");
      if (decimalIdx !== -1 && prev.length - decimalIdx > 2) return prev;
      return prev + k;
    });
  };

  const amount = Number(amountStr) || 0;
  const canSave = amount > 0 && category;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      let exchangeRateAtEntry = null;
      if (currency && currency !== defaultCurrency) {
        exchangeRateAtEntry = await fetchExchangeRate(currency, defaultCurrency);
      }
      await onSave({
        amount, category,
        payer: payer || null,
        date,
        note: note.trim(),
        locationName: location?.name || null,
        locationCoords: location?.coords || null,
        currency: currency || defaultCurrency,
        exchangeRateAtEntry,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={sharedModal(colors).backdrop} onClick={onClose}>
      <div style={sharedModal(colors).sheet} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: colors.ink, fontFamily: SANS }}>{isEdit ? "Edit expense" : "Add expense"}</p>
          <button onClick={onClose} style={sharedBtn(colors).icon} aria-label="Close"><X size={18} color={colors.inkSoft} /></button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: colors.inkFaint, margin: "0 0 4px", fontFamily: SANS, letterSpacing: 0.3 }}>AMOUNT</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label="Currency" style={{ ...sharedSelect(colors), fontSize: 13, fontWeight: 600 }}>
              {currencyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <p style={{ fontSize: 42, fontWeight: 500, margin: 0, color: colors.ink, fontFamily: SERIF }}>{amountStr}</p>
          </div>
        </div>

        {categories.length === 0 ? (
          <div style={{ ...emptyBanner(colors), marginBottom: 18 }}>
            <AlertCircle size={16} color={colors.amber} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12.5, color: colors.ink, margin: 0, fontFamily: SANS, lineHeight: 1.5 }}>No categories yet — add one in Settings first.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Category</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
              {categories.map((cat) => {
                const active = category === cat.id;
                return (
                  <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", borderRadius: 10, cursor: "pointer", background: active ? colors.tealSoft : "transparent", border: active ? `1px solid ${colors.teal}` : `0.5px solid ${colors.border}` }}>
                    <Icon name={cat.icon} size={19} color={active ? colors.teal : colors.inkSoft} />
                    <span style={{ fontSize: 11, color: active ? colors.teal : colors.inkSoft, fontFamily: SANS, fontWeight: active ? 600 : 400 }}>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Paid by</p>
            {members.length === 0 ? (
              <div style={{ ...sharedSelect(colors), display: "flex", alignItems: "center", color: colors.inkFaint, fontSize: 13 }}>No members</div>
            ) : (
              <select value={payer} onChange={(e) => setPayer(e.target.value)} style={{ ...sharedSelect(colors), width: "100%" }}>
                {members.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Date</p>
            <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} style={{ ...sharedSelect(colors), width: "100%" }} />
          </div>
        </div>

        <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Note (optional)</p>
        <input type="text" placeholder="e.g. Trader Joe's" value={note} onChange={(e) => setNote(e.target.value)} style={{ ...sharedInput(colors), width: "100%", marginBottom: 16 }} />

        {showLocationField && (
          <LocationField colors={colors} value={location} onChange={setLocation} />
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "back"].map((k) => (
            <button key={k} onClick={() => pressKey(k)} style={{ padding: "15px", fontSize: 19, borderRadius: 10, border: `0.5px solid ${colors.border}`, background: colors.surface, color: colors.ink, cursor: "pointer", fontFamily: SERIF, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label={k === "back" ? "Backspace" : k}>
              {k === "back" ? <BackspaceIcon size={18} color={colors.ink} /> : k}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {isEdit && (
            <button onClick={onDelete} style={{ ...sharedBtn(colors).dangerOutline, padding: "13px 16px" }} aria-label="Delete expense">
              <Trash2 size={17} />
            </button>
          )}
          <button onClick={handleSave} disabled={!canSave || saving} style={{ ...sharedBtn(colors).primary, flex: 1, opacity: canSave ? 1 : 0.5 }}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Save expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
