import {Autocomplete, AutocompleteItem} from "@heroui/react";
import {useRef, useState} from "react";
import {APPROACH_KEYS, APPROACHES, ApproachChip, ApproachIcon, ApproachKey} from "@/src/components/approaches.tsx";
import {CloseIcon} from "@/src/components/icons.tsx";
import {solutionColor} from "@/src/components/solutionColors.ts";
import {
  FILTER_AUTOCOMPLETE_INPUT_PROPS,
  FilterSwitch,
  useChipRowHasRoom,
} from "@/src/components/treatments/TreatmentFilters.tsx";
import {Disease} from "@/src/model/disease.ts";

/** Filtres de l'onglet « Pathologies ». Un ensemble vide d'approches = toutes les approches. */
export type PathologyFilterState = {
  approaches: Set<ApproachKey>;
  withoutApproach: boolean;
  withoutTreatment: boolean;
};

export const EMPTY_PATHOLOGY_FILTERS: PathologyFilterState = {
  approaches: new Set(),
  withoutApproach: false,
  withoutTreatment: false,
};

/** Nombre de filtres actifs (le filtre « approche » compte pour un, quel que soit le nombre d'approches). */
export function countActivePathologyFilters(f: PathologyFilterState): number {
  return [f.approaches.size > 0, f.withoutApproach, f.withoutTreatment].filter(Boolean).length;
}

/** La pathologie passe-t-elle les filtres ? Plusieurs approches = l'une OU l'autre ; les interrupteurs se cumulent. */
export function matchesPathologyFilters(d: Disease, f: PathologyFilterState): boolean {
  return (
    (f.approaches.size === 0 || (d.approach != null && f.approaches.has(d.approach as ApproachKey))) &&
    (!f.withoutApproach || d.approach == null) &&
    (!f.withoutTreatment || d.cureCount === 0)
  );
}

type PathologyFiltersProps = {
  value: PathologyFilterState;
  onChange: (value: PathologyFilterState) => void;
};

/**
 * Contenu du panneau « Filtres » de l'onglet Pathologies. Même fonctionnement que le filtre par solution
 * des traitements : un champ de recherche pour ajouter une approche + les pastilles choisies sur une ligne.
 */
export function PathologyFilters({value, onChange}: PathologyFiltersProps) {
  /** incrémenté après chaque ajout pour vider le champ de recherche */
  const [pickerKey, setPickerKey] = useState(0);
  const chipsRef = useRef<HTMLDivElement>(null);
  /** reste-t-il assez de place sur la ligne pour une pastille de plus ? */
  const hasRoom = useChipRowHasRoom(chipsRef, value.approaches);

  const selected = APPROACH_KEYS.filter((k) => value.approaches.has(k));
  const available = APPROACH_KEYS.filter((k) => !value.approaches.has(k)).map((key) => ({key, ...APPROACHES[key]}));

  const addApproach = (key: ApproachKey) => {
    // « Sans approche » et une approche précise s'excluent : choisir une approche retire « Sans approche ».
    onChange({...value, approaches: new Set(value.approaches).add(key), withoutApproach: false});
    setPickerKey((k) => k + 1);
  };
  const removeApproach = (key: ApproachKey) => {
    const next = new Set(value.approaches);
    next.delete(key);
    onChange({...value, approaches: next});
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Autocomplete
          key={pickerKey}
          aria-label="Ajouter une approche au filtre"
          size="sm"
          variant="bordered"
          className="w-64 shrink-0"
          placeholder={!hasRoom ? "Plus de place" : available.length === 0 ? "Toutes ajoutées" : "Approche(s)"}
          inputProps={FILTER_AUTOCOMPLETE_INPUT_PROPS}
          isDisabled={!hasRoom || available.length === 0}
          defaultItems={available}
          listboxProps={{emptyContent: "Aucune approche ne correspond."}}
          onSelectionChange={(key) => {
            if (key != null) addApproach(key as ApproachKey);
          }}
        >
          {(a) => (
            <AutocompleteItem
              key={a.key}
              textValue={a.label}
              startContent={<ApproachIcon approach={a.key} size={16} className={solutionColor(a.color).text} />}
            >
              {a.label}
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* Approches choisies, sur une seule ligne : un clic retire l'approche du filtre. */}
        <div ref={chipsRef} className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {selected.map((key) => (
            <button
              key={key}
              type="button"
              title={`Retirer « ${APPROACHES[key].label} » du filtre`}
              onClick={() => removeApproach(key)}
              className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ApproachChip approach={key} endContent={<CloseIcon width={12} height={12} className="mr-1" />} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <FilterSwitch
          isSelected={value.withoutApproach}
          onValueChange={(checked) =>
            onChange({...value, withoutApproach: checked, approaches: checked ? new Set() : value.approaches})
          }
        >
          Sans approche
        </FilterSwitch>
        <FilterSwitch
          isSelected={value.withoutTreatment}
          onValueChange={(checked) => onChange({...value, withoutTreatment: checked})}
        >
          Sans traitement associé
        </FilterSwitch>
      </div>
    </>
  );
}
