import { useState, useCallback } from "react";
import { Wallet, Plus } from "lucide-react";
import { STORAGE_KEY_SPACES, STORAGE_KEY_GLOBAL_SETTINGS, spaceDataKey, SANS, SERIF } from "./lib/constants";
import { uid } from "./lib/utils";
import { useColors } from "./lib/colors";
import { baseStyles, sharedBtn } from "./lib/styles";
import { useStorageValue } from "./hooks/useStorage";
import storage from "./lib/storage";
import SpaceShell from "./components/SpaceShell";
import SpaceWizard from "./components/SpaceWizard";

function GlobalCSS() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; }
      body { background: #111; }
      input, select, button { font-family: ${SANS}; }
      @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      @keyframes sheetUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
    `}</style>
  );
}

function WelcomeScreen({ colors, onCreate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "32px 28px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Wallet size={26} color={colors.teal} />
      </div>
      <p style={{ fontSize: 22, fontWeight: 500, color: colors.ink, fontFamily: SERIF, margin: "0 0 8px" }}>Welcome</p>
      <p style={{ fontSize: 14, color: colors.inkSoft, fontFamily: SANS, margin: "0 0 24px", lineHeight: 1.6, maxWidth: 280 }}>
        Create a space to start tracking spending — for your household, a trip, a business, or anything else.
      </p>
      <button onClick={onCreate} style={{ ...sharedBtn(colors).primary, display: "flex", alignItems: "center", gap: 6 }}>
        <Plus size={16} strokeWidth={2.5} />
        Create your first space
      </button>
    </div>
  );
}

export default function App() {
  const [globalSettings, setGlobalSettings] = useStorageValue(STORAGE_KEY_GLOBAL_SETTINGS, { mode: "light" });
  const [spacesIndex, setSpacesIndex] = useStorageValue(STORAGE_KEY_SPACES, []);
  const [activeSpaceId, setActiveSpaceId] = useState(() => {
    const idx = storage.get(STORAGE_KEY_SPACES) || [];
    return idx[0]?.id || null;
  });
  const [showWizard, setShowWizard] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const mode = globalSettings?.mode || "light";
  const colors = useColors(mode);

  // Derive active space from index — if current ID is gone, fall back to first
  const activeSpace = spacesIndex.find((s) => s.id === activeSpaceId)
    || (spacesIndex.length > 0 ? spacesIndex[0] : null);

  const toggleMode = useCallback(() => {
    setGlobalSettings({ ...globalSettings, mode: mode === "light" ? "dark" : "light" });
  }, [globalSettings, mode, setGlobalSettings]);

  const createSpace = useCallback((spaceMeta) => {
    const id = uid();
    const newEntry = {
      id,
      name: spaceMeta.name,
      themeId: spaceMeta.themeId,
      icon: spaceMeta.icon,
      locationEnabled: false,
      defaultCurrency: spaceMeta.defaultCurrency || "USD",
    };
    const nextIndex = [...spacesIndex, newEntry];
    setSpacesIndex(nextIndex);
    storage.set(spaceDataKey(id, "categories"), spaceMeta.categories);
    storage.set(spaceDataKey(id, "members"), []);
    storage.set(spaceDataKey(id, "expenses"), []);
    storage.set(spaceDataKey(id, "budgets"), {});
    setActiveSpaceId(id);
    setShowWizard(false);
  }, [spacesIndex, setSpacesIndex]);

  const renameSpace = useCallback((id, name) => {
    setSpacesIndex(spacesIndex.map((s) => (s.id === id ? { ...s, name } : s)));
  }, [spacesIndex, setSpacesIndex]);

  const deleteSpace = useCallback((id) => {
    const next = spacesIndex.filter((s) => s.id !== id);
    setSpacesIndex(next);
    for (const key of ["categories", "members", "expenses", "budgets"]) {
      storage.delete(spaceDataKey(id, key));
    }
    if (activeSpaceId === id) {
      setActiveSpaceId(next.length > 0 ? next[0].id : null);
    }
  }, [spacesIndex, setSpacesIndex, activeSpaceId]);

  const updateSpace = useCallback((id, patch) => {
    setSpacesIndex(spacesIndex.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, [spacesIndex, setSpacesIndex]);

  return (
    <div style={baseStyles(colors).app}>
      <GlobalCSS />

      {!activeSpace && !showWizard && (
        <WelcomeScreen colors={colors} onCreate={() => setShowWizard(true)} />
      )}

      {activeSpace && !showWizard && (
        <SpaceShell
          colors={colors}
          mode={mode}
          toggleMode={toggleMode}
          space={activeSpace}
          spacesIndex={spacesIndex}
          onSwitchSpace={(id) => setActiveSpaceId(id)}
          onNewSpace={() => setShowWizard(true)}
          onRenameSpace={renameSpace}
          onDeleteSpace={deleteSpace}
          onUpdateSpace={(patch) => updateSpace(activeSpaceId, patch)}
          showSwitcher={showSwitcher}
          setShowSwitcher={setShowSwitcher}
        />
      )}

      {showWizard && (
        <SpaceWizard
          colors={colors}
          onCancel={() => setShowWizard(false)}
          onCreate={createSpace}
        />
      )}
    </div>
  );
}
