import {ReactNode} from "react";

/** Petit titre de section dans la barre latérale (« Sauvegarde », « Apparence »…). */
export function SidebarLabel({children}: { children: ReactNode }) {
  return (
    <span className="px-1 text-xs font-medium uppercase tracking-wider text-foreground/50">
      {children}
    </span>
  );
}
