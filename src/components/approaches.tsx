import {Chip} from "@heroui/react";
import {ReactNode, SVGProps} from "react";
import {SolutionColorKey, solutionColor} from "@/src/components/solutionColors.ts";

/**
 * Approches des pathologies : les grands systèmes du corps (digestif, respiratoire…), qui servent
 * à classer et filtrer les pathologies. Liste FIXE, définie ici et non modifiable dans l'application :
 * pour en ajouter une, ajouter une entrée (l'ordre ici est l'ordre d'affichage).
 *
 * Une seule approche par pathologie. La clé (ex. "digestive") est enregistrée en base dans
 * Disease.approach : ne jamais renommer ni supprimer une clé existante (les données y font référence).
 * 11 approches = les 11 couleurs de la palette, chacune la sienne.
 * Icônes dans le style de solutionIcons.tsx (trait de 1.75, grille 24×24) ; couleurs de la palette des solutions.
 */
export const APPROACHES = {
  digestive: {
    label: "Digestif",
    color: "orange",
    paths: (
      <>
        {/* estomac : poche fermée, œsophage en haut, sortie vers l'intestin à gauche */}
        <path d="M8.5 2.5v3c0 4 1.8 6.6 4.6 7.6-1.6 1.8-4.8 2-7.6 1.4L3 15v3.2l2.6-.4c1.6 1.9 3.6 2.7 5.6 2.7 5.2 0 8.8-3.6 8.8-9.2 0-5.4-4.3-7.9-8.5-6.3V2.5" />
      </>
    ),
  },
  respiratory: {
    label: "Respiratoire",
    color: "blue",
    paths: (
      <>
        {/* trachée, bronches et poumons */}
        <path d="M12 3v7.5M12 10.5l-2.5 2.5M12 10.5l2.5 2.5" />
        <path d="M9.5 7.5C7 7.5 4 11 4 16.5c0 2.2 1.3 3.5 3 3.5 1.8 0 2.5-1 2.5-3z" />
        <path d="M14.5 7.5c2.5 0 5.5 3.5 5.5 9 0 2.2-1.3 3.5-3 3.5-1.8 0-2.5-1-2.5-3z" />
      </>
    ),
  },
  ent: {
    label: "ORL",
    color: "lime",
    paths: (
      <>
        {/* oreille */}
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
        <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
      </>
    ),
  },
  cardiovascular: {
    label: "Cardio-vasculaire",
    color: "red",
    paths: (
      <>
        {/* cœur traversé par un tracé de pouls */}
        <path d="M12 20.5s-8-4.6-8-10.4a4.4 4.4 0 0 1 8-2.5 4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4z" />
        <path d="M4.5 13H8l1.5-2.5 2.5 5 1.5-2.5h6" />
      </>
    ),
  },
  osteoarticular: {
    label: "Ostéo-articulaire",
    color: "gray",
    // os
    paths: (
      <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5z" />
    ),
  },
  urinary: {
    label: "Urinaire",
    color: "yellow",
    paths: (
      <>
        {/* deux reins, uretères et vessie */}
        <path d="M7 3.5C4.5 3.5 3 5.5 3 8s1.5 4.5 4 4.5c1.5 0 2-1 1.5-2.2-.4-1-.4-1.6 0-2.6.5-1.2 0-4.2-1.5-4.2z" />
        <path d="M17 3.5c2.5 0 4 2 4 4.5s-1.5 4.5-4 4.5c-1.5 0-2-1-1.5-2.2.4-1 .4-1.6 0-2.6-.5-1.2 0-4.2 1.5-4.2z" />
        <path d="M8.7 9c1.3.5 2 1.8 2 3.5v4M15.3 9c-1.3.5-2 1.8-2 3.5v4" />
        <path d="M9 16.5h6a1 1 0 0 1 1 1 3.5 3.5 0 0 1-3.5 3.5h-1A3.5 3.5 0 0 1 8 17.5a1 1 0 0 1 1-1z" />
      </>
    ),
  },
  gynecological: {
    label: "Gynécologique",
    color: "pink",
    // symbole féminin
    paths: (
      <>
        <circle cx="12" cy="8.5" r="5.5" />
        <path d="M12 14v7.5M8.5 18h7" />
      </>
    ),
  },
  nervous: {
    label: "Nerveux",
    color: "violet",
    paths: (
      <>
        {/* neurone : corps cellulaire, dendrites, axone et terminaisons */}
        <circle cx="8.5" cy="8.5" r="2.5" />
        <path d="M8.5 6V2.5M6 8.5H2.5M6.7 6.7 4.5 4.5M10.3 6.7l2.2-2.2M6.7 10.3l-2.2 2.2" />
        <path d="M10.3 10.3l7.2 7.2M17.5 17.5l3.5.5M17.5 17.5l.5 3.5M17.5 17.5l2.5-2.5" />
        <path d="M13 13l1.2-1.2M15.3 15.3l1.2-1.2" />
      </>
    ),
  },
  neuroglandular: {
    label: "Neuro-glandulaire",
    color: "cyan",
    paths: (
      <>
        {/* thyroïde (papillon) sur la trachée */}
        <path d="M12 2.5v4.5M12 17v4.5M10.5 4.5h3M10.5 19.5h3" />
        <path d="M12 12c-.8-4-2.8-6.5-5-6.5-2 0-3 2-3 5.5 0 4 1.8 7 4.5 7 2 0 3-2.4 3.5-6z" />
        <path d="M12 12c.8-4 2.8-6.5 5-6.5 2 0 3 2 3 5.5 0 4-1.8 7-4.5 7-2 0-3-2.4-3.5-6z" />
      </>
    ),
  },
  skin: {
    label: "Cutané",
    color: "brown",
    paths: (
      <>
        {/* coupe de peau : surface ondulée, couches, poil */}
        <path d="M2.5 10c2.4-1.6 4.8 1.6 7.2 0s4.8-1.6 7.2 0 3.5 1 4.6.3" />
        <path d="M2.5 15h19M2.5 20h19" />
        <path d="M14 20v-3.5M14 13.5V5.5l2-2" />
        <circle cx="14" cy="15" r="1.5" />
      </>
    ),
  },
  immune: {
    label: "Immunitaire",
    color: "green",
    paths: (
      <>
        {/* bouclier */}
        <path d="M12 21.5s7.5-3.2 7.5-9.5V5.5L12 2.5 4.5 5.5V12c0 6.3 7.5 9.5 7.5 9.5z" />
        <path d="M12 8.5v6M9 11.5h6" />
      </>
    ),
  },
} satisfies Record<string, { label: string; color: SolutionColorKey; paths: ReactNode }>;

export type ApproachKey = keyof typeof APPROACHES;

/** Toutes les clés, dans l'ordre d'affichage. */
export const APPROACH_KEYS = Object.keys(APPROACHES) as ApproachKey[];

export function isApproachKey(key: string | null | undefined): key is ApproachKey {
  return key != null && key in APPROACHES;
}

/**
 * Clé connue, ou null. Une clé inconnue (ex. venant d'une sauvegarde d'une version plus récente)
 * n'est pas affichée mais reste en base.
 */
export function knownApproach(key: string | null | undefined): ApproachKey | null {
  return isApproachKey(key) ? key : null;
}

type ApproachIconProps = SVGProps<SVGSVGElement> & { approach: ApproachKey; size?: number };

export function ApproachIcon({approach, size = 20, ...props}: ApproachIconProps) {
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
      {APPROACHES[approach].paths}
    </svg>
  );
}

type ApproachChipProps = {
  approach: ApproachKey;
  /** contenu à droite du nom (ex. une croix pour retirer la pastille) */
  endContent?: ReactNode;
};

/** Étiquette d'une approche : son icône + son nom, dans sa couleur (même rendu que SolutionChip). */
export function ApproachChip({approach, endContent}: ApproachChipProps) {
  const a = APPROACHES[approach];
  const c = solutionColor(a.color);
  return (
    <Chip
      size="sm"
      variant="flat"
      classNames={{base: `${c.bg} ${c.text}`}}
      startContent={<ApproachIcon approach={approach} size={14} className="ml-1" />}
      endContent={endContent}
    >
      {a.label}
    </Chip>
  );
}
