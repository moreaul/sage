import {ReactNode, SVGProps} from "react";

/**
 * Icônes des solutions (types de traitement), dessinées à la main dans le même style
 * que src/components/icons.tsx : trait de 1.75, grille 24×24, couleur = currentColor.
 *
 * La clé (ex. "essential-oil") est enregistrée en base dans Treatment_type.icon :
 * ne jamais renommer une clé existante (les données y font référence).
 */
export const SOLUTION_ICONS = {
  "essential-oil": {
    label: "Flacon compte-gouttes",
    paths: (
      <>
        <rect x="10" y="2" width="4" height="3" rx="1" />
        <path d="M9 5h6v3H9z" />
        <path d="M8 8h8a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z" />
        <path d="M12 12.5c-1 1.3-1.6 2.2-1.6 3a1.6 1.6 0 0 0 3.2 0c0-.8-.6-1.7-1.6-3z" />
      </>
    ),
  },
  "herbal-tea": {
    label: "Tasse de tisane",
    paths: (
      <>
        <path d="M4 10h13v3.5a6.5 6.5 0 0 1-6.5 6.5A6.5 6.5 0 0 1 4 13.5z" />
        <path d="M17 11.5h1a2.5 2.5 0 0 1 0 5h-1.6" />
        <path d="M3 22h15" />
        <path d="M8.5 7.5C8.5 5 10 3 13 2.5c0 2.6-1.6 4.6-4.5 5z" />
      </>
    ),
  },
  leaf: {
    label: "Feuille",
    paths: (
      <>
        <path d="M5 19C5 10.5 10 5 20 4c-.6 10-6 15-15 15z" />
        <path d="M5 19l9-9" />
      </>
    ),
  },
  bud: {
    label: "Bourgeon",
    paths: (
      <>
        <path d="M12 22v-8" />
        <path d="M12 14c-2.8 0-4.5-2.2-4.5-4.8S9.6 4.2 12 2c2.4 2.2 4.5 4.6 4.5 7.2S14.8 14 12 14z" />
        <path d="M12 19c-.5-2-2-3-4.5-3 .5 2 2 3 4.5 3z" />
        <path d="M12 19c.5-2 2-3 4.5-3-.5 2-2 3-4.5 3z" />
      </>
    ),
  },
  flower: {
    label: "Fleur",
    paths: (
      <>
        <circle cx="12" cy="9" r="2" />
        <path d="M12 7c-1.8 0-2.6-1.3-2.6-2.6S10.5 2 12 2s2.6 1.1 2.6 2.4S13.8 7 12 7z" />
        <path d="M14 9c0-1.8 1.3-2.6 2.6-2.6S19 7.5 19 9s-1.1 2.6-2.4 2.6S14 10.8 14 9z" />
        <path d="M12 11c1.8 0 2.6 1.3 2.6 2.6S13.5 16 12 16s-2.6-1.1-2.6-2.4S10.2 11 12 11z" />
        <path d="M10 9c0 1.8-1.3 2.6-2.6 2.6S5 10.5 5 9s1.1-2.6 2.4-2.6S10 7.2 10 9z" />
        <path d="M12 16v6" />
        <path d="M12 20c-.8-1.6-2.2-2.4-4-2.4.6 1.6 2 2.4 4 2.4z" />
      </>
    ),
  },
  capsule: {
    label: "Gélule",
    paths: (
      <>
        <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
        <path d="M9.5 9.5l5 5" />
      </>
    ),
  },
  spray: {
    label: "Vaporisateur",
    paths: (
      <>
        <path d="M7 11h7v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
        <path d="M8.5 11V8h4v3" />
        <path d="M8 8V5a1 1 0 0 1 1-1h3.5l2 2v2" />
        <path d="M17.5 5h.01M20 3.5h.01M20 6.5h.01M17.5 8h.01" />
      </>
    ),
  },
  droplet: {
    label: "Goutte",
    paths: <path d="M12 2.5C9 6.5 6 9.8 6 14a6 6 0 0 0 12 0c0-4.2-3-7.5-6-11.5z" />,
  },
  clay: {
    label: "Bol d’argile",
    paths: (
      <>
        <path d="M3 12h18c0 4.4-4 8-9 8s-9-3.6-9-8z" />
        <path d="M6.5 12c1-2.8 3-4.5 5.5-4.5s4.5 1.7 5.5 4.5" />
        <path d="M10 5.5h.01M14 4.5h.01" />
      </>
    ),
  },
  mortar: {
    label: "Mortier",
    paths: (
      <>
        <path d="M4 12h16c0 3.9-3.6 7-8 7s-8-3.1-8-7z" />
        <path d="M9.5 19l-.5 2.5h6l-.5-2.5" />
        <path d="M13.5 12l5.2-7.2a1.4 1.4 0 0 1 2.3 1.6L15.5 12" />
      </>
    ),
  },
  jar: {
    label: "Pot",
    paths: (
      <>
        <rect x="7" y="2.5" width="10" height="3.5" rx="1" />
        <path d="M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v10a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 19z" />
        <path d="M9 12.5h6M9 15.5h4" />
      </>
    ),
  },
  sprout: {
    label: "Jeune pousse",
    paths: (
      <>
        <path d="M12 21v-9" />
        <path d="M12 12C12 8.2 9.3 6 5 6c0 3.8 2.7 6 7 6z" />
        <path d="M12 10c0-3.1 2.4-5 6.5-5 0 3.1-2.4 5-6.5 5z" />
        <path d="M8 21h8" />
      </>
    ),
  },
  bee: {
    label: "Abeille",
    paths: (
      <>
        <ellipse cx="12" cy="14.5" rx="4" ry="5.5" />
        <path d="M8.2 13h7.6M8.5 16.5h7" />
        <path d="M10.2 9.4C7.4 10 4.2 8.8 4.5 6.3 4.8 4 8.6 4.6 10.2 9.4z" />
        <path d="M13.8 9.4c2.8.6 6-.6 5.7-3.1-.3-2.3-4.1-1.7-5.7 3.1z" />
        <path d="M12 20v1.8" />
      </>
    ),
  },
  dumbbell: {
    label: "Haltère",
    paths: (
      <>
        <rect x="4" y="6.5" width="3.5" height="11" rx="1" />
        <rect x="16.5" y="6.5" width="3.5" height="11" rx="1" />
        <path d="M7.5 12h9M2 10v4M22 10v4" />
      </>
    ),
  },
  apple: {
    label: "Pomme",
    paths: (
      <>
        <path d="M12 8c-1.6-1-3.2-1.3-4.7-.9C4.6 7.8 3.7 10.6 4.2 13.5c.7 4 3.3 7.5 5.6 7.5.9 0 1.4-.4 2.2-.4s1.3.4 2.2.4c2.3 0 4.9-3.5 5.6-7.5.5-2.9-.4-5.7-3.1-6.4-1.5-.4-3.1-.1-4.7.9z" />
        <path d="M12 8c0-2 .6-3.6 2-5" />
        <path d="M12.6 5.6c1.3-1.5 3.2-1.9 4.9-1.3-.9 1.7-2.8 2.3-4.9 1.3z" />
      </>
    ),
  },
  runner: {
    label: "Sprinteur",
    // Pictogramme plein façon « sprinteur » : pièces séparées, petite tête, buste qui part de la
    // cuisse et s'arrête avant la tête, membres effilés en pointe. Contrairement aux autres icônes
    // (au trait), formes pleines générées le long de courbes avec une épaisseur décroissante.
    paths: (
      <g fill="currentColor" stroke="none">
        <circle cx="16.4" cy="5.5" r="1.90" />
        <path d="M7.25 11.59A1.30 1.30 0 0 0 9.55 12.81L9.67 12.57L9.78 12.35L9.89 12.13L10.00 11.91L10.11 11.70L10.22 11.49L10.34 11.28L10.46 11.07L10.59 10.87L10.72 10.67L10.85 10.47L10.99 10.27L11.13 10.08L11.29 9.89L11.44 9.69L11.61 9.51L11.78 9.32L11.96 9.13L12.15 8.95L12.35 8.77L12.55 8.59L12.77 8.41L12.99 8.24L13.23 8.07L13.17 7.93L12.88 7.95L12.59 7.98L12.30 8.02L12.01 8.08L11.72 8.14L11.44 8.22L11.16 8.31L10.88 8.41L10.61 8.52L10.34 8.64L10.07 8.78L9.81 8.93L9.55 9.09L9.31 9.26L9.06 9.44L8.83 9.64L8.60 9.85L8.38 10.06L8.16 10.29L7.96 10.53L7.76 10.79L7.58 11.05L7.40 11.32Z" />
        <path d="M12.06 7.23A0.90 0.90 0 0 0 13.34 5.97L12.88 5.52L12.42 5.11L11.96 4.75L11.51 4.45L11.07 4.20L10.63 4.00L10.19 3.87L9.76 3.80L9.33 3.79L8.92 3.86L8.54 4.01L8.20 4.22L7.90 4.49L7.65 4.81L7.43 5.17L7.24 5.57L7.08 6.01L6.95 6.49L6.83 7.03L6.73 7.60L6.66 8.23L6.60 8.90L6.55 9.62L6.53 10.39L6.67 10.41L6.79 9.65L6.92 8.94L7.06 8.30L7.22 7.71L7.39 7.18L7.58 6.71L7.77 6.29L7.98 5.94L8.19 5.66L8.40 5.44L8.60 5.28L8.80 5.18L8.98 5.13L9.16 5.11L9.33 5.13L9.53 5.18L9.75 5.27L10.00 5.40L10.27 5.57L10.58 5.80L10.91 6.07L11.26 6.40L11.64 6.78Z" />
        <path d="M17.40 8.69A0.95 0.95 0 0 0 15.60 9.31L15.79 9.81L15.99 10.28L16.22 10.70L16.46 11.09L16.73 11.43L17.02 11.72L17.33 11.97L17.68 12.16L18.05 12.28L18.43 12.33L18.80 12.30L19.16 12.20L19.49 12.04L19.80 11.83L20.10 11.58L20.38 11.29L20.66 10.96L20.94 10.59L21.22 10.17L21.50 9.71L21.78 9.21L22.07 8.66L22.37 8.07L22.67 7.44L22.53 7.36L22.15 7.95L21.77 8.48L21.41 8.96L21.06 9.40L20.71 9.78L20.39 10.11L20.07 10.39L19.77 10.62L19.50 10.79L19.25 10.91L19.03 10.98L18.84 11.00L18.70 10.99L18.59 10.95L18.50 10.89L18.41 10.82L18.31 10.72L18.21 10.58L18.09 10.39L17.96 10.16L17.82 9.87L17.69 9.53L17.55 9.15Z" />
        <path d="M8.67 10.51A1.25 1.25 0 0 0 7.93 12.89L8.15 12.96L8.35 13.02L8.56 13.09L8.76 13.16L8.96 13.24L9.16 13.33L9.36 13.42L9.56 13.52L9.75 13.62L9.95 13.73L10.14 13.85L10.34 13.97L10.53 14.10L10.72 14.23L10.91 14.37L11.10 14.52L11.28 14.67L11.47 14.83L11.65 14.99L11.84 15.16L12.02 15.34L12.20 15.52L12.38 15.71L12.57 15.92A1.10 1.10 0 0 0 14.23 14.48L14.04 14.25L13.84 14.02L13.64 13.79L13.43 13.57L13.22 13.36L13.01 13.15L12.79 12.95L12.57 12.75L12.35 12.56L12.12 12.38L11.90 12.20L11.66 12.03L11.43 11.87L11.19 11.71L10.95 11.56L10.71 11.41L10.46 11.28L10.21 11.15L9.96 11.02L9.71 10.90L9.45 10.79L9.19 10.69L8.92 10.59Z" />
        <path d="M14.13 16.12A1.10 1.10 0 0 0 12.67 14.48L12.48 14.68L12.29 14.87L12.11 15.07L11.92 15.26L11.72 15.45L11.51 15.63L11.30 15.82L11.08 16.00L10.85 16.18L10.61 16.36L10.37 16.54L10.12 16.71L9.86 16.88L9.59 17.05L9.32 17.21L9.03 17.37L8.74 17.53L8.44 17.68L8.14 17.83L7.82 17.98L7.50 18.12L7.17 18.26L6.83 18.40L6.48 18.53L6.52 18.67L6.89 18.64L7.26 18.60L7.62 18.56L7.98 18.51L8.33 18.45L8.68 18.39L9.03 18.32L9.37 18.25L9.70 18.17L10.03 18.08L10.36 17.99L10.68 17.89L11.00 17.78L11.31 17.67L11.62 17.55L11.92 17.42L12.22 17.28L12.51 17.14L12.80 16.99L13.08 16.83L13.36 16.66L13.63 16.49L13.89 16.31Z" />
        <path d="M9.37 13.32A1.05 1.05 0 0 0 7.83 11.88L7.55 12.27L7.26 12.65L6.98 13.02L6.69 13.40L6.40 13.77L6.12 14.14L5.83 14.51L5.55 14.88L5.26 15.25L4.98 15.62L4.70 15.99L4.42 16.35L4.14 16.72L3.86 17.08L3.59 17.44L3.31 17.81L3.04 18.17L2.77 18.53L2.50 18.89L2.23 19.24L1.96 19.60L1.69 19.96L1.43 20.31L1.16 20.67L1.24 20.73L1.56 20.43L1.88 20.12L2.20 19.82L2.53 19.51L2.85 19.21L3.18 18.90L3.51 18.59L3.84 18.28L4.17 17.97L4.51 17.67L4.84 17.36L5.18 17.05L5.52 16.74L5.86 16.43L6.20 16.12L6.54 15.80L6.89 15.49L7.23 15.18L7.58 14.87L7.93 14.56L8.29 14.25L8.64 13.93L9.00 13.62Z" />
      </g>
    ),
  },
  plate: {
    label: "Assiette et couverts",
    paths: (
      <>
        <circle cx="12" cy="12" r="5.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M2 3v4a1.5 1.5 0 0 0 3 0V3M3.5 3v18" />
        <path d="M21 21V3c-1.4 1-2.5 3-2.5 6v4H21" />
      </>
    ),
  },
  waves: {
    label: "Vagues",
    paths: <path d="M2 7.5c1.67 0 1.67-1.5 3.33-1.5s1.67 1.5 3.33 1.5 1.67-1.5 3.34-1.5 1.66 1.5 3.33 1.5 1.67-1.5 3.33-1.5 1.67 1.5 3.34 1.5M2 12.75c1.67 0 1.67-1.5 3.33-1.5s1.67 1.5 3.33 1.5 1.67-1.5 3.34-1.5 1.66 1.5 3.33 1.5 1.67-1.5 3.33-1.5 1.67 1.5 3.34 1.5M2 18c1.67 0 1.67-1.5 3.33-1.5s1.67 1.5 3.33 1.5 1.67-1.5 3.34-1.5 1.66 1.5 3.33 1.5 1.67-1.5 3.33-1.5 1.67 1.5 3.34 1.5" />,
  },
  wind: {
    label: "Souffle",
    paths: (
      <>
        <path d="M3 9h9.5A2.5 2.5 0 1 0 10 6.5" />
        <path d="M3 13h14a3 3 0 1 1-3 3" />
        <path d="M3 17h5" />
      </>
    ),
  },
  footprint: {
    label: "Pied",
    // Empreinte pleine (plante avec voûte + cinq orteils), plus reconnaissable qu'au trait.
    paths: (
      <g fill="currentColor" stroke="none" transform="translate(-2.08 -1.25) scale(1.1)">
        <path d="M8.6 10.2C9.4 8.6 14.4 8.4 15.6 10.2c1 1.6-.2 4.6-.6 6.4-.4 2-.6 4.4-2.8 4.4-2 0-2.6-1.8-2.3-3.6.3-1.6 1-2.6.5-4-.4-1-2.4-1.6-1.8-3.2z" />
        <ellipse cx="9.7" cy="6.1" rx="1.35" ry="1.65" />
        <circle cx="12.3" cy="5.5" r="1" />
        <circle cx="14.2" cy="6.1" r=".85" />
        <circle cx="15.7" cy="7.2" r=".72" />
        <circle cx="16.8" cy="8.6" r=".6" />
      </g>
    ),
  },
  moon: {
    label: "Lune",
    paths: (
      <>
        <path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z" />
        <path d="M17 3v3.5M15.25 4.75h3.5" />
      </>
    ),
  },
  sun: {
    label: "Soleil",
    paths: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </>
    ),
  },
  hourglass: {
    label: "Sablier",
    paths: (
      <>
        <path d="M6 2.5h12M6 21.5h12" />
        <path d="M7.5 2.5v2.8c0 2.7 4.5 4.1 4.5 6.7 0-2.6 4.5-4 4.5-6.7V2.5" />
        <path d="M7.5 21.5v-2.8c0-2.7 4.5-4.1 4.5-6.7 0 2.6 4.5 4 4.5 6.7v2.8" />
        <path d="M9.5 19.5h5" />
      </>
    ),
  },
  crystal: {
    label: "Cristal",
    paths: (
      <>
        <path d="M6.5 3.5h11L21 9l-9 11.5L3 9z" />
        <path d="M3 9h18" />
        <path d="M10 3.5L8.5 9l3.5 11.5L15.5 9 14 3.5" />
      </>
    ),
  },
  quartz: {
    label: "Pierres (quartz)",
    paths: (
      <>
        <path d="M10 21V8.5L12 4l2 4.5V21" />
        <path d="M10 8.5h4" />
        <path d="M5.5 21v-7.5l2-2.5 2 2.5" />
        <path d="M14.5 15l2-2.5 2 2.5v6" />
        <path d="M3 21h18" />
      </>
    ),
  },
  "yin-yang": {
    label: "Yin et yang",
    paths: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path
          fill="currentColor"
          stroke="none"
          fillRule="evenodd"
          d="M12 2.5a9.5 9.5 0 0 1 0 19 4.75 4.75 0 0 1 0-9.5 4.75 4.75 0 0 0 0-9.5zM12 15.6a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 1 0 0-2.3z"
        />
        <circle cx="12" cy="7.25" r="1.15" fill="currentColor" stroke="none" />
      </>
    ),
  },
  molecule: {
    label: "Molécule",
    paths: (
      <>
        <circle cx="6" cy="7" r="2.2" />
        <circle cx="18" cy="7" r="2.2" />
        <circle cx="12" cy="17" r="2.6" />
        <path d="M8.2 7h7.6M7.13 8.89l3.53 5.88M16.87 8.89l-3.53 5.88" />
      </>
    ),
  },
  battery: {
    label: "Batterie qui se recharge",
    paths: (
      <>
        <rect x="2.5" y="7" width="17" height="10" rx="2" />
        <path d="M22 10.5v3" />
        <path d="M11.5 9L9 12.5h4L10.5 16" />
      </>
    ),
  },
  hand: {
    label: "Main",
    paths: (
      <>
        <path d="M18 11V6a2 2 0 0 0-4 0" />
        <path d="M14 10V4a2 2 0 0 0-4 0v2" />
        <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </>
    ),
  },
  heart: {
    label: "Cœur",
    paths: <path d="M12 20.5s-8-4.6-8-10.4a4.4 4.4 0 0 1 8-2.5 4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4z" />,
  },
} satisfies Record<string, { label: string; paths: ReactNode }>;

export type SolutionIconKey = keyof typeof SOLUTION_ICONS;

/** Icône utilisée quand une solution n'en a pas (ou une clé inconnue). */
export const DEFAULT_SOLUTION_ICON: SolutionIconKey = "sprout";

export const SOLUTION_ICON_KEYS = Object.keys(SOLUTION_ICONS) as SolutionIconKey[];

export function isSolutionIconKey(key: string | null | undefined): key is SolutionIconKey {
  return key != null && key in SOLUTION_ICONS;
}

type SolutionIconProps = SVGProps<SVGSVGElement> & {
  /** clé enregistrée en base ; null/inconnue → icône par défaut */
  icon: string | null | undefined;
  size?: number;
};

export function SolutionIcon({icon, size = 20, ...props}: SolutionIconProps) {
  const key = isSolutionIconKey(icon) ? icon : DEFAULT_SOLUTION_ICON;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {SOLUTION_ICONS[key].paths}
    </svg>
  );
}

/**
 * Icône suggérée d'après le nom d'une solution (ex. « Huile essentielle » → flacon).
 * Renvoie null si rien ne correspond.
 */
export function suggestSolutionIcon(name: string): SolutionIconKey | null {
  const n = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const rules: [RegExp, SolutionIconKey][] = [
    [/huile|essentiel|aromath/, "essential-oil"],
    [/hydrolat|eau florale|spray/, "spray"],
    [/hydrother|bain|douche|sauna|thermal/, "waves"],
    [/tisane|infusion|decoction|the\b/, "herbal-tea"],
    // avant « gemmo » (gemmothérapie = bourgeons)
    [/gemmolog|lithother|pierre|cristaux/, "quartz"],
    [/bourgeon|gemmo/, "bud"],
    [/chinois|mtc|acupunct|qi ?gong|tai ?chi|yin|yang/, "yin-yang"],
    // avant « complément » et « nutrition »
    [/micro-?nutri/, "molecule"],
    [/revitalis|vitalite|energie|tonus|fatigue/, "battery"],
    [/magnetis|reiki|imposition|toucher/, "hand"],
    [/emotion|psycho|coeur/, "heart"],
    [/fleur|bach|floral/, "flower"],
    [/oligo|mineraux|sels mineraux|cristal/, "crystal"],
    [/complement|gelule|vitamine|mineral|capsule|comprime/, "capsule"],
    [/argile|cataplasme|boue/, "clay"],
    [/teinture|elixir|goutte|macerat/, "droplet"],
    [/apitherap|miel|propolis|pollen|gelee royale|abeille/, "bee"],
    [/baume|creme|pommade|onguent/, "jar"],
    [/poudre|mortier/, "mortar"],
    [/plante|phyto|herbe|feuille/, "leaf"],
    // après « complément alimentaire » (gélule), qui contient aussi « aliment »
    [/exercice|sport|activite physique|course|marche|fitness|mouvement/, "runner"],
    [/musculation|renforcement/, "dumbbell"],
    [/aliment|nutrition|diet|regime|repas|cuisine/, "plate"],
    [/respir|relax|souffle|meditation|coherence cardiaque|stress|sophro/, "wind"],
    [/reflexo|massage|plantaire|pied/, "footprint"],
    [/sommeil|insomnie|dormir|nuit/, "moon"],
    [/helio|soleil|lumiere|lumino/, "sun"],
    [/jeune|detox|monodiete|drainage/, "hourglass"],
  ];
  return rules.find(([re]) => re.test(n))?.[1] ?? null;
}
