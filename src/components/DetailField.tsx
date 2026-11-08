import {ReactNode} from "react";

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
