import {Button, Input} from "@heroui/react";
import {ReactNode, useState} from "react";
import {ChevronLeftIcon, FilterIcon, PlusIcon, SearchIcon} from "@/src/components/icons.tsx";

type InputContainerProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onNew: () => void;
  searchPlaceholder?: string;
  /** contenu du panneau de filtres ; absent → pas de bouton « Filtres » */
  filters?: ReactNode;
  /** nombre de filtres actifs, affiché sur le bouton (visible même panneau replié) */
  activeFilterCount?: number;
  /** remet tous les filtres à zéro (lien « Réinitialiser » du panneau) */
  onResetFilters?: () => void;
};

/**
 * Barre au-dessus de chaque liste : bouton « Nouveau », bouton « Filtres » (optionnel) et champ de
 * recherche. Le bouton « Filtres » déplie un panneau sous la barre.
 */
export default function InputContainer({
  search,
  onSearchChange,
  onNew,
  searchPlaceholder = "Rechercher",
  filters,
  activeFilterCount = 0,
  onResetFilters,
}: InputContainerProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        {/* même style translucide (« flat ») que les boutons Voir / Modifier des lignes */}
        <Button
          color="primary"
          variant="flat"
          radius="lg"
          className="h-11 font-semibold px-5 shrink-0"
          startContent={<PlusIcon />}
          onPress={onNew}
        >
          Nouveau
        </Button>

        {filters && (
          <Button
            // vert quand un filtre est actif, pour qu'on le remarque même panneau replié
            color={hasActiveFilters ? "primary" : "default"}
            variant="flat"
            radius="lg"
            className="h-11 shrink-0 px-4 font-medium"
            aria-expanded={filtersOpen}
            startContent={<FilterIcon width={16} height={16} />}
            endContent={
              <ChevronLeftIcon
                width={16}
                height={16}
                className={`transition-transform duration-200 ${filtersOpen ? "-rotate-90" : "rotate-0"}`}
              />
            }
            onPress={() => setFiltersOpen((open) => !open)}
          >
            Filtres{hasActiveFilters && ` · ${activeFilterCount}`}
          </Button>
        )}

        <Input
          fullWidth
          isClearable
          radius="md"
          variant="bordered"
          placeholder={searchPlaceholder}
          value={search}
          onValueChange={onSearchChange}
          onClear={() => onSearchChange("")}
          startContent={<SearchIcon className="text-foreground/50" />}
          classNames={{
            inputWrapper: [
              "h-11 bg-content4 border-2 border-divider",
              "data-[hover=true]:border-default-700",
              "group-data-[focus=true]:border-primary",
            ].join(" "),
            input: "text-sm",
          }}
        />
      </div>

      {filters && (
        // Dépliage animé : la ligne de grille passe de 0fr à 1fr (hauteur du contenu).
        <div
          inert={!filtersOpen}
          className={`grid transition-[grid-template-rows,margin-top,opacity] duration-200 ease-out ${
            filtersOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-2 rounded-xl bg-content2 p-3">
              {/* En-tête : titre + « Réinitialiser » sur la même ligne, pour gagner de la hauteur */}
              <div className="flex h-6 items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-foreground/50">Filtres</span>
                {hasActiveFilters && onResetFilters && (
                  <Button
                    size="sm"
                    variant="light"
                    className="h-6 min-w-0 px-2 text-xs text-foreground/70"
                    onPress={onResetFilters}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
              {filters}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
