import { SANS, SERIF } from "./constants";

export function sharedBtn(colors) {
  return {
    primary: {
      background: colors.teal, color: "#fff", border: "none", borderRadius: 11,
      padding: "13px 18px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: SANS,
    },
    primarySm: {
      display: "flex", alignItems: "center", gap: 5, background: colors.teal, color: "#fff",
      border: "none", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 600,
      cursor: "pointer", fontFamily: SANS,
    },
    secondary: {
      background: "none", color: colors.ink, border: `0.5px solid ${colors.border}`, borderRadius: 11,
      padding: "12px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: SANS,
    },
    secondarySm: {
      display: "flex", alignItems: "center", gap: 5, background: "none", color: colors.ink,
      border: `0.5px solid ${colors.border}`, borderRadius: 9, padding: "9px 14px", fontSize: 13,
      fontWeight: 500, cursor: "pointer", fontFamily: SANS,
    },
    danger: {
      background: colors.brick, color: "#fff", border: "none", borderRadius: 10,
      padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS,
    },
    dangerOutline: {
      background: "none", color: colors.brick, border: `0.5px solid ${colors.brick}`, borderRadius: 11,
      padding: "12px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: SANS,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
    },
    icon: {
      background: "none", border: "none", cursor: "pointer", padding: 4,
      display: "flex", alignItems: "center", justifyContent: "center",
    },
  };
}

export function sharedInput(colors) {
  return {
    padding: "10px 12px", borderRadius: 9, border: `0.5px solid ${colors.border}`,
    background: colors.surface, fontSize: 14, color: colors.ink, fontFamily: SANS, outline: "none",
  };
}

export function sharedSelect(colors) {
  return {
    padding: "9px 10px", borderRadius: 9, border: `0.5px solid ${colors.border}`,
    background: colors.surface, fontSize: 13, color: colors.ink, fontFamily: SANS, outline: "none",
  };
}

export function sharedModal(colors) {
  return {
    backdrop: {
      position: "fixed", inset: 0, background: colors.overlay,
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
    },
    sheet: {
      background: colors.bg, width: "100%", maxWidth: 420, borderRadius: "20px 20px 0 0",
      padding: "20px 18px 22px", maxHeight: "92vh", overflowY: "auto",
      animation: "sheetUp 0.2s ease",
    },
  };
}

export function sharedToast(colors) {
  return {
    position: "fixed", bottom: 84, left: "50%", transform: "translateX(-50%)",
    background: colors.ink, color: colors.bg, padding: "9px 16px", borderRadius: 20,
    fontSize: 13, fontFamily: SANS, display: "flex", alignItems: "center", gap: 7,
    animation: "toastIn 0.2s ease", whiteSpace: "nowrap", zIndex: 200,
  };
}

export function sectionLabel(colors) {
  return { fontSize: 14, fontWeight: 600, margin: "0 0 12px", color: colors.ink, fontFamily: SANS };
}

export function emptyBanner(colors) {
  return { padding: 12, background: colors.amberSoft, borderRadius: 10, display: "flex", gap: 9 };
}

export function stepHeading(colors) {
  return { fontSize: 20, fontWeight: 500, color: colors.ink, fontFamily: SERIF, margin: 0 };
}

export function stepSub(colors) {
  return { fontSize: 13, color: colors.inkSoft, fontFamily: SANS, margin: "6px 0 0", lineHeight: 1.5 };
}

export function baseStyles(colors) {
  return {
    app: {
      background: colors.bg, minHeight: "100dvh", maxWidth: 420, margin: "0 auto",
      position: "relative", fontFamily: SANS, overflow: "hidden",
      borderLeft: `0.5px solid ${colors.border}`, borderRight: `0.5px solid ${colors.border}`,
      color: colors.ink,
    },
  };
}
