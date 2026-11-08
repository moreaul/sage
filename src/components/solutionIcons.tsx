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
    [/tisane|infusion|decoction|the\b/, "herbal-tea"],
    [/bourgeon|gemmo/, "bud"],
    [/fleur|bach|floral/, "flower"],
    [/complement|gelule|vitamine|mineral|capsule|comprime/, "capsule"],
    [/argile|cataplasme|boue/, "clay"],
    [/teinture|elixir|goutte|macerat/, "droplet"],
    [/baume|creme|pommade|onguent|miel/, "jar"],
    [/poudre|mortier/, "mortar"],
    [/plante|phyto|herbe|feuille/, "leaf"],
  ];
  return rules.find(([re]) => re.test(n))?.[1] ?? null;
}
