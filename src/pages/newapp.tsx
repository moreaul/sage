import {Tooltip} from "@heroui/react";
import {useEffect, useState} from "react";
import {SearchContainer} from "@/src/components/SearchContainer.tsx";
import {ChevronLeftIcon} from "@/src/components/icons.tsx";
import {BackupSection} from "@/src/components/sidebar/BackupSection.tsx";
import {ThemeSwitch} from "@/src/components/sidebar/ThemeSwitch.tsx";
import {UpdateSection} from "@/src/components/sidebar/UpdateSection.tsx";

const SIDEBAR_STORAGE_KEY = "sage-sidebar-collapsed";

/** État replié / déplié de la barre latérale, mémorisé entre deux lancements. */
function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // stockage indisponible : l'état reste valable pour la session
    }
  }, [collapsed]);

  return [collapsed, setCollapsed] as const;
}

export default function NewApp() {
  // Incrémenté après un import : change la key de SearchContainer, qui est remonté
  // et recharge donc toutes ses données depuis la base.
  const [dataVersion, setDataVersion] = useState(0);
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  const toggleLabel = collapsed ? "Afficher le menu" : "Masquer le menu";

  return (
    <div className="flex h-full">
      {/* Conteneur commun barre + poignée : la poignée déborde de la barre (qui coupe son
          contenu), et le survol de l'une ou de l'autre la fait apparaître (`group`). */}
      <div className="group relative z-10 h-full shrink-0">
      {/* Barre latérale à gauche, pleine hauteur, repliable en un rail étroit */}
      <aside
        className={`${collapsed ? "w-12 px-1.5 py-4" : "w-64 px-4 py-6"} bg-content2 flex flex-col justify-between gap-8 h-full overflow-y-auto overflow-x-hidden transition-[width] duration-200`}
      >
        {/* En-tête : logo, nom et sous-titre (seulement le logo quand la barre est repliée) */}
        <header className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-1"}`}>
          <img src="/feuille.ico" alt="" className={`${collapsed ? "size-8" : "size-10"} shrink-0`} />
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <h1 className="text-2xl font-semibold leading-tight text-foreground">Sage</h1>
              <p className="text-xs leading-snug text-foreground/60">Bibliothèque de soins naturels</p>
            </div>
          )}
        </header>

        {/* Actions en bas de la barre. Masquées (pas démontées) quand la barre est repliée :
            la vérification des mises à jour au démarrage et ses fenêtres restent actives. */}
        <div className={collapsed ? "hidden" : "flex flex-col gap-6"}>
          <BackupSection onImported={() => setDataVersion((v) => v + 1)} />
          <ThemeSwitch />
          <UpdateSection />
        </div>
      </aside>

      {/* Poignée sur le bord droit, alignée sur le logo (zone vide, loin des boutons). Barre ouverte : discrète, bien visible au
          survol. Barre repliée : toujours visible, pour qu'on sache toujours la rouvrir. */}
      <Tooltip content={toggleLabel} placement="right" delay={400} closeDelay={0}>
        <button
          type="button"
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
          className={`absolute right-0 ${collapsed ? "top-8" : "top-11"} flex size-7 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-divider bg-content1 text-foreground/70 shadow-md outline-none transition-[opacity,color] hover:text-primary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary ${collapsed ? "opacity-100" : "opacity-30 group-hover:opacity-100"}`}
        >
          <ChevronLeftIcon width={16} height={16} className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </Tooltip>
      </div>

      {/* Contenu principal */}
      <div className="h-full p-6 flex-1 flex flex-col overflow-hidden">
        <SearchContainer key={dataVersion} />
      </div>
    </div>
  );
}
