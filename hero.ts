// hero.ts — thème HeroUI de Sage.
// Couleurs reprises de l'ancienne version Python (thème vert de CustomTkinter).
//
// Correspondance des surfaces (utilisées via bg-background / bg-content1…4) :
//   background  fond de la fenêtre
//   content1    panneau principal, lignes de la liste, fenêtres modales
//   content2    barre latérale, zone de la liste
//   content3    barre d'onglets
//   content4    champs de saisie
import { heroui } from "@heroui/react";

const white = "#ffffff";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#ebebeb",
        foreground: "#1a1c1e",
        content1: { DEFAULT: "#dbdbdb", foreground: "#1a1c1e" },
        content2: { DEFAULT: "#cfcfcf", foreground: "#1a1c1e" },
        content3: { DEFAULT: "#979da2", foreground: white },
        content4: { DEFAULT: "#f9f9fa", foreground: "#1a1c1e" },
        divider: "#8f959b",
        focus: "#2cc985",
        // gris : 50 = le plus clair (convention HeroUI en thème clair)
        default: {
          50: "#f9f9fa",
          100: "#ebebeb",
          200: "#dbdbdb",
          300: "#cfcfcf",
          400: "#979da2",
          500: "#8f959b",
          600: "#6b7075",
          700: "#4a4f53",
          800: "#2f3235",
          900: "#1a1c1e",
          DEFAULT: "#cfcfcf",
          foreground: "#1a1c1e",
        },
        primary: {
          50: "#e9faf2",
          100: "#c9f2df",
          200: "#9de8c6",
          300: "#6ddcab",
          400: "#45d295",
          500: "#2cc985",
          600: "#22a86e",
          700: "#0c955a",
          800: "#0b7347",
          900: "#085234",
          DEFAULT: "#2cc985",
          foreground: white,
        },
      },
    },
    dark: {
      colors: {
        background: "#242424",
        foreground: "#f2f2f2",
        content1: { DEFAULT: "#2b2b2b", foreground: "#f2f2f2" },
        content2: { DEFAULT: "#333333", foreground: "#f2f2f2" },
        content3: { DEFAULT: "#4a4a4a", foreground: white },
        content4: { DEFAULT: "#343638", foreground: "#f2f2f2" },
        divider: "#595e61",
        focus: "#2fa572",
        // gris : 50 = le plus foncé (convention HeroUI en thème sombre)
        default: {
          50: "#242424",
          100: "#2b2b2b",
          200: "#333333",
          300: "#3f3f3f",
          400: "#4a4a4a",
          500: "#595e61",
          600: "#696969",
          700: "#8c8c8c",
          800: "#b5b5b5",
          900: "#dcdcdc",
          DEFAULT: "#4a4a4a",
          foreground: white,
        },
        primary: {
          50: "#062e1d",
          100: "#0a4029",
          200: "#106a43",
          300: "#1b8457",
          400: "#259a67",
          500: "#2fa572",
          600: "#4fba8b",
          700: "#78cda7",
          800: "#a6e0c6",
          900: "#d3f0e3",
          DEFAULT: "#2fa572",
          foreground: white,
        },
      },
    },
  },
});
