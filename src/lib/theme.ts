import { useEffect, type CSSProperties } from "react";
import { DEFAULT_THEME, themeById } from "@shared";

/**
 * CSS variables for a theme. Classic returns nothing, so it keeps following
 * the viewer's light or dark setting from index.css, unless `always` is set
 * (used for printing, which should get the light palette).
 */
export function themeVars(id?: string, always = false): CSSProperties | undefined {
  if (!always && (!id || id === DEFAULT_THEME)) return undefined;
  const c = themeById(id).colors;
  return {
    "--page": c.page,
    "--surface": c.surface,
    "--ink": c.ink,
    "--muted": c.muted,
    "--line": c.line,
    "--accent": c.accent,
    "--accent-soft": c.accentSoft,
    "--on-accent": c.onAccent,
    colorScheme: isDark(c.surface) ? "dark" : "light",
  } as CSSProperties;
}

function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

/** Applies a card's theme to the whole page (background, browser bar color). */
export function usePageTheme(id?: string) {
  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars(id) ?? {};
    const keys = Object.keys(vars);
    for (const [k, v] of Object.entries(vars)) {
      if (k === "colorScheme") root.style.colorScheme = String(v);
      else root.style.setProperty(k, String(v));
    }
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevColor = meta?.content;
    if (meta && id && id !== DEFAULT_THEME) meta.content = themeById(id).colors.accent;
    return () => {
      for (const k of keys) {
        if (k === "colorScheme") root.style.colorScheme = "";
        else root.style.removeProperty(k);
      }
      if (meta && prevColor) meta.content = prevColor;
    };
  }, [id]);
}
