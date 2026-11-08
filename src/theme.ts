import {useEffect, useState} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "sage-theme";

/** Thème enregistré (sombre par défaut). Lu aussi par le script inline de index.html. */
export function getSavedTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Applique le thème sur <html> : HeroUI suit la classe, y compris pour les modales et notifications. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

/** Thème courant + setter qui l'applique et le mémorise. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // stockage indisponible : le thème reste appliqué pour la session
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
