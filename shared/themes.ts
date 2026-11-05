// Card themes. "classic" follows the viewer's light or dark setting; the
// others are fixed palettes so a card looks the same everywhere, printed too.

export interface ThemeColors {
  page: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentSoft: string;
  /** Text on accent-colored buttons and the initials tile */
  onAccent: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    colors: { page: "#e9ecf1", surface: "#ffffff", ink: "#15203a", muted: "#5b6478", line: "#dde2ea", accent: "#2a5bd7", accentSoft: "#e6edfc", onAccent: "#ffffff" },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: { page: "#0b1020", surface: "#141b2e", ink: "#eef2fb", muted: "#a0aac2", line: "#273150", accent: "#8ab4ff", accentSoft: "#1d2a4a", onAccent: "#0b1020" },
  },
  {
    id: "forest",
    name: "Forest",
    colors: { page: "#e4ece5", surface: "#fbfdfb", ink: "#16291d", muted: "#55695b", line: "#d3e0d6", accent: "#1f7a46", accentSoft: "#e0f0e6", onAccent: "#ffffff" },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: { page: "#f6e7dc", surface: "#fffaf6", ink: "#3a1d10", muted: "#7a5747", line: "#eedccf", accent: "#b4440e", accentSoft: "#fbe6da", onAccent: "#ffffff" },
  },
  {
    id: "rose",
    name: "Rose",
    colors: { page: "#f5e6ec", surface: "#fffafc", ink: "#3b1525", muted: "#7c5466", line: "#efd8e1", accent: "#ad2a5d", accentSoft: "#fbe3ec", onAccent: "#ffffff" },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: { page: "#dceef0", surface: "#f8fdfd", ink: "#0f2b30", muted: "#4d6a6f", line: "#cfe4e6", accent: "#08707c", accentSoft: "#d9f0f2", onAccent: "#ffffff" },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: { page: "#ebe7f5", surface: "#fcfbff", ink: "#251a40", muted: "#635a7c", line: "#e0daf0", accent: "#6a45c9", accentSoft: "#ece6fb", onAccent: "#ffffff" },
  },
  {
    id: "mono",
    name: "Mono",
    colors: { page: "#e6e6e6", surface: "#ffffff", ink: "#111111", muted: "#5e5e5e", line: "#dddddd", accent: "#111111", accentSoft: "#eeeeee", onAccent: "#ffffff" },
  },
  {
    id: "gold",
    name: "Noir & Gold",
    colors: { page: "#0d0d0d", surface: "#171614", ink: "#f4efe4", muted: "#aaa18f", line: "#2e2b25", accent: "#d4af5a", accentSoft: "#2a2418", onAccent: "#171614" },
  },
  {
    id: "paper",
    name: "Paper",
    colors: { page: "#ece4d4", surface: "#fbf7ef", ink: "#2b2418", muted: "#6f6553", line: "#e6dcc8", accent: "#8a5a2b", accentSoft: "#f1e6d4", onAccent: "#fbf7ef" },
  },
];

export const DEFAULT_THEME = "classic";

export const themeById = (id?: string) => themes.find((t) => t.id === id) ?? themes[0]!;
