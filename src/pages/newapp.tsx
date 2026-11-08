import {useState} from "react";
import {SearchContainer} from "@/src/components/SearchContainer.tsx";
import {BackupSection} from "@/src/components/sidebar/BackupSection.tsx";
import {ThemeSwitch} from "@/src/components/sidebar/ThemeSwitch.tsx";
import {UpdateSection} from "@/src/components/sidebar/UpdateSection.tsx";

export default function NewApp() {
  // Incrémenté après un import : change la key de SearchContainer, qui est remonté
  // et recharge donc toutes ses données depuis la base.
  const [dataVersion, setDataVersion] = useState(0);

  return (
    <div className="flex h-full">
      {/* Barre latérale à gauche, pleine hauteur */}
      <aside className="w-64 shrink-0 bg-content2 px-4 py-6 flex flex-col justify-between gap-8 h-full overflow-y-auto">
        {/* En-tête : logo, nom et sous-titre */}
        <header className="flex items-center gap-3 px-1">
          <img src="/feuille.ico" alt="" className="size-10 shrink-0" />
          <div className="flex min-w-0 flex-col">
            <h1 className="text-2xl font-semibold leading-tight text-foreground">Sage</h1>
            <p className="text-xs leading-snug text-foreground/60">Bibliothèque de soins naturels</p>
          </div>
        </header>

        {/* Actions en bas de la barre */}
        <div className="flex flex-col gap-6">
          <BackupSection onImported={() => setDataVersion((v) => v + 1)} />
          <ThemeSwitch />
          <UpdateSection />
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="h-full p-6 flex-1 flex flex-col overflow-hidden">
        <SearchContainer key={dataVersion} />
      </div>
    </div>
  );
}
