import {Chip} from "@heroui/react";
import {ReactNode} from "react";
import {solutionColor} from "@/src/components/solutionColors.ts";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";

type SolutionChipProps = {
  name: string;
  /** clé d'icône enregistrée en base (null → icône par défaut) */
  icon: string | null | undefined;
  /** clé de couleur enregistrée en base (null → vert) */
  color: string | null | undefined;
  /** contenu à droite du nom (ex. une croix pour retirer la pastille) */
  endContent?: ReactNode;
};

/** Étiquette d'une solution : son icône + son nom, dans la couleur choisie pour la solution. */
export function SolutionChip({name, icon, color, endContent}: SolutionChipProps) {
  const c = solutionColor(color);
  return (
    <Chip
      size="sm"
      variant="flat"
      classNames={{base: `${c.bg} ${c.text}`}}
      startContent={<SolutionIcon icon={icon} size={14} className="ml-1" />}
      endContent={endContent}
    >
      {name}
    </Chip>
  );
}
