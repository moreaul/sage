import {AppTabItem, AppTabs} from "@/src/components/AppTabs.tsx";
import {PathologiesTab} from "@/src/components/pathologies/PathologiesTab.tsx";
import {TreatmentsTab} from "@/src/components/treatments/TreatmentsTab.tsx";
import {SolutionsTab} from "@/src/components/solutions/SolutionsTab.tsx";

// Les onglets inactifs sont démontés par HeroUI (destroyInactiveTabPanel) :
// revenir sur un onglet recharge donc ses données depuis la base.
const items: AppTabItem[] = [
  {
    key: "pathologies",
    title: "Pathologies",
    content: (<PathologiesTab />),
  },
  {
    key: "treatments",
    title: "Traitements",
    content: (<TreatmentsTab />),
  },
  {
    key: "solutions",
    title: "Solutions",
    content: (<SolutionsTab />),
  },
];

export function SearchContainer() {
  return (
    <section className="flex flex-col h-full bg-content1 rounded-2xl p-4 gap-1 overflow-hidden">
      {/* flex-1 + min-h-0 sur le wrapper et le panneau : la hauteur reste bornée
          jusqu'à la liste de ResultsContainer, qui peut alors scroller. */}
      <AppTabs
        items={items}
        className="flex w-full flex-col flex-1 min-h-0"
        tabsProps={{
          size: "lg",
          fullWidth: true,
          radius: "md",
          classNames: {
            // barre grise, onglet actif vert, texte blanc (comme l'ancienne version)
            tabList: "bg-content3 p-1",
            cursor: "!bg-primary shadow-none",
            tabContent: "text-white/90 font-medium group-data-[selected=true]:text-primary-foreground",
            panel: "flex flex-col flex-1 min-h-0 px-0",
          },
        }}
      ></AppTabs>
    </section>
  );
}
