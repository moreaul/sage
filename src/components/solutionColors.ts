/**
 * Couleurs proposées pour les pastilles des solutions (types de traitement).
 *
 * La clé (ex. "violet") est enregistrée en base dans Treatment_type.color :
 * ne jamais renommer une clé existante (les données y font référence).
 * Les classes Tailwind sont écrites en entier pour être détectées au build.
 * 11 couleurs : une ligne complète dans le sélecteur du formulaire (largeur de la fenêtre).
 */
export const SOLUTION_COLORS = {
  green: {
    label: "Vert",
    swatch: "bg-primary",
    bg: "bg-primary/15",
    text: "text-primary",
    hover: "group-hover/row:bg-primary/25",
  },
  lime: {
    label: "Vert clair",
    swatch: "bg-lime-500",
    bg: "bg-lime-500/15",
    text: "text-lime-700 dark:text-lime-300",
    hover: "group-hover/row:bg-lime-500/25",
  },
  cyan: {
    label: "Cyan",
    swatch: "bg-cyan-500",
    bg: "bg-cyan-500/15",
    text: "text-cyan-700 dark:text-cyan-300",
    hover: "group-hover/row:bg-cyan-500/25",
  },
  blue: {
    label: "Bleu",
    swatch: "bg-sky-500",
    bg: "bg-sky-500/15",
    text: "text-sky-700 dark:text-sky-300",
    hover: "group-hover/row:bg-sky-500/25",
  },
  violet: {
    label: "Violet",
    swatch: "bg-violet-500",
    bg: "bg-violet-500/15",
    text: "text-violet-700 dark:text-violet-300",
    hover: "group-hover/row:bg-violet-500/25",
  },
  pink: {
    label: "Rose",
    swatch: "bg-pink-500",
    bg: "bg-pink-500/15",
    text: "text-pink-700 dark:text-pink-300",
    hover: "group-hover/row:bg-pink-500/25",
  },
  red: {
    label: "Rouge",
    swatch: "bg-red-500",
    bg: "bg-red-500/15",
    text: "text-red-700 dark:text-red-300",
    hover: "group-hover/row:bg-red-500/25",
  },
  orange: {
    label: "Orange",
    swatch: "bg-orange-500",
    bg: "bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-300",
    hover: "group-hover/row:bg-orange-500/25",
  },
  yellow: {
    label: "Jaune miel",
    swatch: "bg-amber-400",
    bg: "bg-amber-400/20",
    text: "text-amber-700 dark:text-amber-300",
    hover: "group-hover/row:bg-amber-400/30",
  },
  brown: {
    label: "Marron",
    swatch: "bg-amber-800",
    bg: "bg-amber-800/15",
    text: "text-amber-900 dark:text-orange-200",
    hover: "group-hover/row:bg-amber-800/25",
  },
  gray: {
    label: "Gris",
    swatch: "bg-stone-500",
    bg: "bg-stone-500/15",
    text: "text-stone-700 dark:text-stone-300",
    hover: "group-hover/row:bg-stone-500/25",
  },
} satisfies Record<string, { label: string; swatch: string; bg: string; text: string; hover: string }>;

export type SolutionColorKey = keyof typeof SOLUTION_COLORS;

/** Couleur utilisée quand une solution n'en a pas (ou une clé inconnue) : le vert de l'application. */
export const DEFAULT_SOLUTION_COLOR: SolutionColorKey = "green";

export const SOLUTION_COLOR_KEYS = Object.keys(SOLUTION_COLORS) as SolutionColorKey[];

export function isSolutionColorKey(key: string | null | undefined): key is SolutionColorKey {
  return key != null && key in SOLUTION_COLORS;
}

/**
 * Couleurs retirées de la palette → couleur la plus proche. La migration 9 a converti la base ;
 * ceci couvre les anciennes sauvegardes importées qui contiennent encore ces clés.
 */
const RETIRED_COLORS: Record<string, SolutionColorKey> = {teal: "cyan", indigo: "blue", fuchsia: "pink"};

/** Classes d'une couleur enregistrée en base ; null/inconnue → couleur par défaut. */
export function solutionColor(key: string | null | undefined) {
  if (isSolutionColorKey(key)) return SOLUTION_COLORS[key];
  return SOLUTION_COLORS[(key && RETIRED_COLORS[key]) || DEFAULT_SOLUTION_COLOR];
}
