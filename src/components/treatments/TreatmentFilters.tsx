import {Autocomplete, AutocompleteItem, Switch} from "@heroui/react";
import {ReactNode, RefObject, useLayoutEffect, useRef, useState} from "react";
import {CloseIcon} from "@/src/components/icons.tsx";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {solutionColor} from "@/src/components/solutionColors.ts";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";
import {Treatment} from "@/src/model/treatment.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";

/** Filtres de l'onglet « Traitements ». Un ensemble vide de solutions = toutes les solutions. */
export type TreatmentFilterState = {
  solutionIds: Set<number>;
  withContraindication: boolean;
  withInteractions: boolean;
  withoutPathology: boolean;
};

export const EMPTY_TREATMENT_FILTERS: TreatmentFilterState = {
  solutionIds: new Set(),
  withContraindication: false,
  withInteractions: false,
  withoutPathology: false,
};

/** Nombre de filtres actifs (le filtre « solution » compte pour un, quel que soit le nombre de pastilles). */
export function countActiveFilters(f: TreatmentFilterState): number {
  return [f.solutionIds.size > 0, f.withContraindication, f.withInteractions, f.withoutPathology]
    .filter(Boolean).length;
}

/** Le traitement passe-t-il les filtres ? Plusieurs solutions = l'une OU l'autre ; les interrupteurs se cumulent. */
export function matchesTreatmentFilters(t: Treatment, f: TreatmentFilterState): boolean {
  return (
    (f.solutionIds.size === 0 || f.solutionIds.has(t.typeId)) &&
    (!f.withContraindication || !!t.contraindication?.trim()) &&
    (!f.withInteractions || t.interactionCount > 0) &&
    (!f.withoutPathology || t.cureCount === 0)
  );
}

/**
 * Place libre minimale (px) pour ajouter une pastille de plus sur la ligne : environ la largeur
 * d'une pastille au nom long (« Respiration et relaxation » + icône + croix).
 */
const MIN_FREE_WIDTH = 220;
/** Espace entre les pastilles (gap-2). */
const CHIP_GAP = 8;

/**
 * Reste-t-il assez de place à droite des pastilles de `ref` pour en ajouter une ? Mesuré à chaque
 * changement de `selection` et quand la fenêtre change de taille. Partagé avec le filtre des pathologies.
 */
export function useChipRowHasRoom(ref: RefObject<HTMLDivElement | null>, selection: unknown): boolean {
  const [hasRoom, setHasRoom] = useState(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const used = [...el.children].reduce((w, child) => w + (child as HTMLElement).offsetWidth + CHIP_GAP, 0);
      setHasRoom(el.clientWidth - used >= MIN_FREE_WIDTH);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, selection]);
  return hasRoom;
}

/**
 * Contour du champ « ajouter au filtre » : le même que le champ de recherche. Le contour « bordered »
 * par défaut (default-200) disparaît sur le panneau en thème sombre.
 */
export const FILTER_AUTOCOMPLETE_INPUT_PROPS = {
  classNames: {
    inputWrapper: [
      "bg-content4 border-2 border-divider",
      "data-[hover=true]:border-default-700",
      "group-data-[focus=true]:border-primary",
    ].join(" "),
  },
};

type TreatmentFiltersProps = {
  /** solutions proposées dans la recherche (celles qui ont au moins un traitement) */
  solutions: TreatmentType[];
  value: TreatmentFilterState;
  onChange: (value: TreatmentFilterState) => void;
};

/** Contenu du panneau « Filtres » de l'onglet Traitements. */
export function TreatmentFilters({solutions, value, onChange}: TreatmentFiltersProps) {
  /** incrémenté après chaque ajout pour vider le champ de recherche */
  const [pickerKey, setPickerKey] = useState(0);
  const chipsRef = useRef<HTMLDivElement>(null);
  /** reste-t-il assez de place sur la ligne pour une pastille de plus ? */
  const hasRoom = useChipRowHasRoom(chipsRef, value.solutionIds);

  const selected = solutions.filter((s) => value.solutionIds.has(s.id));
  const available = solutions.filter((s) => !value.solutionIds.has(s.id));

  const setSolutions = (ids: Set<number>) => onChange({...value, solutionIds: ids});
  const addSolution = (id: number) => {
    setSolutions(new Set(value.solutionIds).add(id));
    setPickerKey((k) => k + 1);
  };
  const removeSolution = (id: number) => {
    const next = new Set(value.solutionIds);
    next.delete(id);
    setSolutions(next);
  };
  const setFlag = (key: "withContraindication" | "withInteractions" | "withoutPathology") =>
    (checked: boolean) => onChange({...value, [key]: checked});

  return (
    <>
      <div className="flex items-center gap-3">
        <Autocomplete
          key={pickerKey}
          aria-label="Ajouter une solution au filtre"
          size="sm"
          variant="bordered"
          className="w-64 shrink-0"
          placeholder={
            !hasRoom ? "Plus de place" : available.length === 0 ? "Toutes ajoutées" : "Solution(s)"
          }
          inputProps={FILTER_AUTOCOMPLETE_INPUT_PROPS}
          isDisabled={!hasRoom || available.length === 0}
          defaultItems={available}
          listboxProps={{emptyContent: "Aucune solution ne correspond."}}
          onSelectionChange={(key) => {
            if (key != null) addSolution(Number(key));
          }}
        >
          {(s) => (
            <AutocompleteItem
              key={String(s.id)}
              textValue={s.name}
              startContent={<SolutionIcon icon={s.icon} size={16} className={solutionColor(s.color).text} />}
            >
              {s.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* Pastilles choisies, sur une seule ligne : un clic retire la solution du filtre. */}
        <div ref={chipsRef} className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {selected.map((s) => (
            <button
              key={s.id}
              type="button"
              title={`Retirer « ${s.name} » du filtre`}
              onClick={() => removeSolution(s.id)}
              className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <SolutionChip
                name={s.name}
                icon={s.icon}
                color={s.color}
                endContent={<CloseIcon width={12} height={12} className="mr-1" />}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <FilterSwitch isSelected={value.withContraindication} onValueChange={setFlag("withContraindication")}>
          Avec contre-indications
        </FilterSwitch>
        <FilterSwitch isSelected={value.withInteractions} onValueChange={setFlag("withInteractions")}>
          Avec interactions
        </FilterSwitch>
        <FilterSwitch isSelected={value.withoutPathology} onValueChange={setFlag("withoutPathology")}>
          Sans pathologie associée
        </FilterSwitch>
      </div>
    </>
  );
}

/**
 * Interrupteur compact à la taille du libellé. Le fond « désactivé » par défaut de HeroUI
 * (default-200) vaut exactement content2 en thème sombre (#333, voir hero.ts) et disparaît
 * sur le panneau : on prend default-500, visible sur content2 dans les deux thèmes.
 */
export function FilterSwitch({isSelected, onValueChange, children}: {
  isSelected: boolean;
  onValueChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Switch
      size="sm"
      isSelected={isSelected}
      onValueChange={onValueChange}
      classNames={{
        // 32 px de large, 2 px de marge : le rond (14 px) se décale de 14 px une fois activé
        wrapper: "h-[18px] w-8 px-0.5 bg-default-500",
        thumb: "w-3.5 h-3.5 group-data-[selected=true]:ms-3.5",
        label: "text-sm",
      }}
    >
      {children}
    </Switch>
  );
}
