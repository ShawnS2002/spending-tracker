import { useState } from "react";
import { Sun, Moon, Users, LayoutGrid, FolderPlus, ChevronRight, ArrowLeft, Trash2, Plus, Pencil, Check, Coins } from "lucide-react";
import { SANS, SERIF, CURATED_CURRENCIES, CURRENCY_NAMES } from "../lib/constants";
import { uid } from "../lib/utils";
import { sharedBtn, sharedInput, emptyBanner } from "../lib/styles";
import Icon from "./Icon";

function VisualSettingsSection({ colors, mode, toggleMode }) {
  return (
    <div>
      <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: colors.ink, fontFamily: SERIF }}>Visual settings</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: "0 0 18px", fontFamily: SANS }}>Applies across all your spaces.</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: `0.5px solid ${colors.border}`, background: colors.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mode === "dark" ? <Moon size={15} color={colors.inkSoft} /> : <Sun size={15} color={colors.inkSoft} />}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: colors.ink, fontFamily: SANS }}>Dark mode</p>
            <p style={{ fontSize: 12, margin: "1px 0 0", color: colors.inkFaint, fontFamily: SANS }}>{mode === "dark" ? "On" : "Off"}</p>
          </div>
        </div>
        <button
          onClick={toggleMode}
          aria-label="Toggle dark mode"
          style={{ width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative", background: mode === "dark" ? colors.teal : colors.border, transition: "background 0.2s" }}
        >
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: mode === "dark" ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
        </button>
      </div>
    </div>
  );
}

function MembersSection({ colors, members, onSave }) {
  const [newName, setNewName] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const addMember = () => {
    const name = newName.trim();
    if (!name || members.includes(name)) return;
    onSave([...members, name]);
    setNewName("");
  };

  const removeMember = (name) => onSave(members.filter((m) => m !== name));
  const startEdit = (idx) => { setEditingIdx(idx); setEditValue(members[idx]); };
  const commitEdit = () => {
    const name = editValue.trim();
    if (!name) { setEditingIdx(null); return; }
    if (members.includes(name) && members[editingIdx] !== name) { setEditingIdx(null); return; }
    onSave(members.map((m, i) => (i === editingIdx ? name : m)));
    setEditingIdx(null);
  };

  return (
    <div>
      <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: colors.ink, fontFamily: SERIF }}>Members</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: "0 0 18px", fontFamily: SANS }}>People who can be tagged as a payer in this space.</p>
      {members.length === 0 && (
        <div style={{ ...emptyBanner(colors), marginBottom: 14 }}>
          <Users size={16} color={colors.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: colors.ink, margin: 0, fontFamily: SANS, lineHeight: 1.5 }}>No members yet. Add the first one below.</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {members.map((m, idx) => (
          <div key={m + idx} style={{ background: colors.surface, borderRadius: 12, border: `0.5px solid ${colors.border}`, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: colors.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: colors.teal, fontFamily: SANS, flexShrink: 0 }}>
                {m.slice(0, 2).toUpperCase()}
              </div>
              {editingIdx === idx ? (
                <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); }} style={{ ...sharedInput(colors), flex: 1, padding: "6px 8px", fontSize: 14 }} />
              ) : (
                <span style={{ fontSize: 14, color: colors.ink, fontFamily: SANS }}>{m}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {editingIdx !== idx && <button onClick={() => startEdit(idx)} style={sharedBtn(colors).icon} aria-label={`Rename ${m}`}><Pencil size={14} color={colors.inkFaint} /></button>}
              <button onClick={() => removeMember(m)} style={sharedBtn(colors).icon} aria-label={`Remove ${m}`}><Trash2 size={14} color={colors.inkFaint} /></button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="text" placeholder="Add a member" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addMember(); }} style={{ ...sharedInput(colors), flex: 1 }} />
        <button onClick={addMember} style={sharedBtn(colors).primarySm}><Plus size={16} strokeWidth={2.5} />Add</button>
      </div>
    </div>
  );
}

function CategoriesSection({ colors, categories, onSave }) {
  const [newName, setNewName] = useState("");
  const addCategory = () => {
    const name = newName.trim();
    if (!name) return;
    onSave([...categories, { id: "custom_" + uid(), name, icon: "Tag" }]);
    setNewName("");
  };
  const removeCategory = (id) => onSave(categories.filter((c) => c.id !== id));

  return (
    <div>
      <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: colors.ink, fontFamily: SERIF }}>Categories</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: "0 0 18px", fontFamily: SANS }}>Used when logging expenses and setting budgets.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ background: colors.surface, borderRadius: 12, border: `0.5px solid ${colors.border}`, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={cat.icon} size={15} color={colors.inkSoft} />
              </div>
              <span style={{ fontSize: 14, color: colors.ink, fontFamily: SANS }}>{cat.name}</span>
            </div>
            <button onClick={() => removeCategory(cat.id)} style={sharedBtn(colors).icon} aria-label={`Remove ${cat.name}`}><Trash2 size={14} color={colors.inkFaint} /></button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="text" placeholder="Add a category" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }} style={{ ...sharedInput(colors), flex: 1 }} />
        <button onClick={addCategory} style={sharedBtn(colors).primarySm}><Plus size={16} strokeWidth={2.5} />Add</button>
      </div>
    </div>
  );
}

function CurrencySection({ colors, space, onUpdateSpace }) {
  const [query, setQuery] = useState("");
  const defaultCurrency = space.defaultCurrency || "USD";

  const filtered = CURATED_CURRENCIES.filter((code) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return code.toLowerCase().includes(q) || (CURRENCY_NAMES[code] || "").toLowerCase().includes(q);
  });

  return (
    <div>
      <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: colors.ink, fontFamily: SERIF }}>Default currency</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: "0 0 18px", fontFamily: SANS }}>Budgets and totals are shown in this currency. Individual expenses can still be logged in any currency.</p>
      <input
        type="text"
        placeholder="Search currency"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ ...sharedInput(colors), width: "100%", marginBottom: 12 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((code) => {
          const isDefault = code === defaultCurrency;
          return (
            <button
              key={code}
              onClick={() => onUpdateSpace({ defaultCurrency: code })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                background: isDefault ? colors.tealSoft : colors.surface,
                border: isDefault ? `1px solid ${colors.teal}` : `0.5px solid ${colors.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isDefault ? colors.teal : colors.inkSoft, fontFamily: SANS, minWidth: 34 }}>{code}</span>
                <span style={{ fontSize: 14, color: isDefault ? colors.teal : colors.ink, fontFamily: SANS }}>{CURRENCY_NAMES[code]}</span>
              </div>
              {isDefault && <Check size={15} color={colors.teal} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ManageSpaceSection({ colors, space, onRename, onDelete, onOpenSwitcher, onToggleLocation }) {
  const [name, setName] = useState(space.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const commitRename = () => {
    const n = name.trim();
    if (n && n !== space.name) onRename(space.id, n);
    else setName(space.name);
  };

  return (
    <div>
      <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: colors.ink, fontFamily: SERIF }}>Manage space</p>
      <p style={{ fontSize: 13, color: colors.inkSoft, margin: "0 0 18px", fontFamily: SANS }}>Rename, switch, or remove this space.</p>
      <p style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 6px", fontFamily: SANS }}>Space name</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={commitRename} onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }} style={{ ...sharedInput(colors), width: "100%", marginBottom: 18 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: `0.5px solid ${colors.border}`, background: colors.surface, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: colors.ink, fontFamily: SANS }}>Location tracking</p>
          <p style={{ fontSize: 12, margin: "1px 0 0", color: colors.inkFaint, fontFamily: SANS }}>Show map on Home screen</p>
        </div>
        <button
          onClick={() => onToggleLocation(!space.locationEnabled)}
          style={{ width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative", background: space.locationEnabled ? colors.teal : colors.border, transition: "background 0.2s" }}
        >
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: space.locationEnabled ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
        </button>
      </div>

      <button onClick={onOpenSwitcher} style={{ ...sharedBtn(colors).secondary, width: "100%", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        <LayoutGrid size={15} />
        Switch to another space
      </button>

      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)} style={{ ...sharedBtn(colors).dangerOutline, width: "100%" }}>
          <Trash2 size={15} />
          Delete this space
        </button>
      ) : (
        <div style={{ padding: 14, background: colors.brickSoft, borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: colors.ink, margin: "0 0 12px", fontFamily: SANS, lineHeight: 1.5 }}>
            Delete "{space.name}" and all its expenses, budgets, members, and categories? This can't be undone.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ ...sharedBtn(colors).secondary, flex: 1 }}>Cancel</button>
            <button onClick={() => onDelete(space.id)} style={{ ...sharedBtn(colors).danger, flex: 1 }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsScreen({ colors, mode, toggleMode, space, members, categories, onSaveMembers, onSaveCategories, onRenameSpace, onDeleteSpace, onOpenSwitcher, onUpdateSpace }) {
  const [section, setSection] = useState(null);

  if (section === null) {
    const items = [
      { id: "visual", label: "Visual settings", icon: mode === "dark" ? Moon : Sun, sub: mode === "dark" ? "Dark theme" : "Light theme" },
      { id: "members", label: "Members", icon: Users, sub: `${members.length} ${members.length === 1 ? "person" : "people"}` },
      { id: "categories", label: "Categories", icon: LayoutGrid, sub: `${categories.length} categories` },
      { id: "currencies", label: "Default currency", icon: Coins, sub: space.defaultCurrency || "USD" },
      { id: "space", label: "Manage space", icon: FolderPlus, sub: space.name },
    ];
    return (
      <div style={{ padding: "8px 18px" }}>
        <p style={{ fontSize: 12.5, color: colors.inkFaint, margin: 0, fontFamily: SANS, textTransform: "uppercase", letterSpacing: 0.5 }}>Preferences</p>
        <p style={{ fontSize: 22, fontWeight: 500, margin: "2px 0 20px", color: colors.ink, fontFamily: SERIF }}>Settings</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button key={item.id} onClick={() => setSection(item.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "13px 14px", borderRadius: 12, border: `0.5px solid ${colors.border}`, background: colors.surface, cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: colors.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ItemIcon size={15} color={colors.inkSoft} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: colors.ink, fontFamily: SANS }}>{item.label}</p>
                    <p style={{ fontSize: 12, margin: "1px 0 0", color: colors.inkFaint, fontFamily: SANS }}>{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={16} color={colors.inkFaint} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 18px" }}>
      <button onClick={() => setSection(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 14 }}>
        <ArrowLeft size={16} color={colors.inkSoft} />
        <span style={{ fontSize: 13, color: colors.inkSoft, fontFamily: SANS }}>Settings</span>
      </button>
      {section === "visual" && <VisualSettingsSection colors={colors} mode={mode} toggleMode={toggleMode} />}
      {section === "members" && <MembersSection colors={colors} members={members} onSave={onSaveMembers} />}
      {section === "categories" && <CategoriesSection colors={colors} categories={categories} onSave={onSaveCategories} />}
      {section === "currencies" && <CurrencySection colors={colors} space={space} onUpdateSpace={onUpdateSpace} />}
      {section === "space" && (
        <ManageSpaceSection
          colors={colors} space={space}
          onRename={onRenameSpace} onDelete={onDeleteSpace}
          onOpenSwitcher={onOpenSwitcher}
          onToggleLocation={(val) => onUpdateSpace({ locationEnabled: val })}
        />
      )}
    </div>
  );
}
