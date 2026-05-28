"use client";

import * as React from "react";

export type Theme = "light" | "dark";
export type Palette = "terracota" | "bordo" | "verde";

type ThemeState = {
  theme: Theme;
  palette: Palette;
  setTheme: (t: Theme) => void;
  setPalette: (p: Palette) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeState | undefined>(undefined);

const THEME_KEY = "frs.theme";
const PALETTE_KEY = "frs.palette";

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return (localStorage.getItem(key) as T) || fallback;
}

function applyToDom(theme: Theme, palette: Palette) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.dataset.palette = palette;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    readStored<Theme>(THEME_KEY, "light"),
  );
  const [palette, setPaletteState] = React.useState<Palette>(() =>
    readStored<Palette>(PALETTE_KEY, "terracota"),
  );

  React.useEffect(() => {
    applyToDom(theme, palette);
  }, [theme, palette]);

  const setTheme = React.useCallback((t: Theme) => {
    localStorage.setItem(THEME_KEY, t);
    setThemeState(t);
  }, []);

  const setPalette = React.useCallback((p: Palette) => {
    localStorage.setItem(PALETTE_KEY, p);
    setPaletteState(p);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const value = React.useMemo(
    () => ({ theme, palette, setTheme, setPalette, toggleTheme }),
    [theme, palette, setTheme, setPalette, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
