import { useMemo } from "react";

export function useColors(mode) {
  return useMemo(() => {
    if (mode === "dark") {
      return {
        bg: "#1C1B18", surface: "#26241F", sand: "#2E2C26", ink: "#F2EFE7",
        inkSoft: "#B5B1A4", inkFaint: "#7A776B", border: "#3B3833",
        teal: "#3FB897", tealSoft: "#1B3A32", amber: "#E0A23E", amberSoft: "#3D2F16",
        brick: "#E07270", brickSoft: "#3E2220", overlay: "rgba(0,0,0,0.55)",
      };
    }
    return {
      bg: "#FAF8F4", surface: "#FFFFFF", sand: "#F1EFE8", ink: "#23211E",
      inkSoft: "#6B685F", inkFaint: "#A6A399", border: "#E6E2D8",
      teal: "#0F6E56", tealSoft: "#E1F5EE", amber: "#BA7517", amberSoft: "#FAEEDA",
      brick: "#A32D2D", brickSoft: "#FCEBEB", overlay: "rgba(35,33,30,0.45)",
    };
  }, [mode]);
}
