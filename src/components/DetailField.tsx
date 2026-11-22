import {ReactNode} from "react";
import {ChevronLeftIcon} from "@/src/components/icons.tsx";

/** Un champ en lecture seule dans une fiche « Voir ». N'affiche rien si la valeur est vide. */
export function DetailField({label, children}: { label: string; children: ReactNode }) {
  if (children == null || children === "") return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-foreground/50">{label}</span>
      <div className="text-sm text-foreground whitespace-pre-line">{children}</div>
    </div>
  );
}

/** Titre de section dans une fiche ou un formulaire. */
export function SectionTitle({children}: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-foreground/80 mt-2">{children}</h3>;
}

/**
 * Carte d'une fiche qui mène vers une autre fiche (ex. un traitement depuis une pathologie).
 * Le chevron à droite signale qu'elle est cliquable. Sans `onPress`, c'est une simple carte.
 */
export function LinkCard({onPress, label, children}: { onPress?: () => void; label: string; children: ReactNode }) {
  if (!onPress) {
    return <div className="flex flex-col gap-2 rounded-xl bg-content2 p-3">{children}</div>;
  }
  return (
    <button
      type="button"
      onClick={onPress}
      title={label}
      className="group flex w-full cursor-pointer items-start gap-2 rounded-xl bg-content2 p-3 text-left transition-colors hover:bg-content3 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
      <ChevronLeftIcon
        width={16}
        height={16}
        className="mt-0.5 shrink-0 rotate-180 text-foreground/40 transition-colors group-hover:text-primary"
      />
    </button>
  );
}
