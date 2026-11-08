import {Chip} from "@heroui/react";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";

/** Étiquette d'une solution : son icône + son nom. */
export function SolutionChip({name, icon}: { name: string; icon: string | null | undefined }) {
  return (
    <Chip
      size="sm"
      variant="flat"
      color="primary"
      startContent={<SolutionIcon icon={icon} size={14} className="ml-1" />}
    >
      {name}
    </Chip>
  );
}
