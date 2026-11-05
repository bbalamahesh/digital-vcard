import { useColorScheme } from "react-native";

// Same palette as the web card, so both feel like one product.
const light = {
  page: "#e9ecf1",
  surface: "#ffffff",
  ink: "#15203a",
  muted: "#5b6478",
  line: "#dde2ea",
  accent: "#2a5bd7",
  accentSoft: "#e6edfc",
  onAccent: "#ffffff",
};

const dark: typeof light = {
  page: "#0f1420",
  surface: "#171e2e",
  ink: "#e8ecf5",
  muted: "#98a2b8",
  line: "#2a3347",
  accent: "#7aa2ff",
  accentSoft: "#1f2b47",
  onAccent: "#0f1420",
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}

export const mono = "monospace";
