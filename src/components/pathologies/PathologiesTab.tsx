import {useCallback, useEffect, useMemo, useState} from "react";
import ResultsContainer, {ResultItem} from "@/src/components/ResultsContainer.tsx";
import {ConfirmDeleteModal} from "@/src/components/ConfirmDeleteModal.tsx";
import {PathologyFormModal} from "@/src/components/pathologies/PathologyFormModal.tsx";
import {DetailModal, DetailTarget} from "@/src/components/DetailModal.tsx";
import {deleteDisease, getAllDiseases} from "@/src/database/diseaseRepository.ts";
import {Disease} from "@/src/model/disease.ts";
import {APPROACHES, ApproachChip, knownApproach} from "@/src/components/approaches.tsx";
import {
  countActivePathologyFilters,
  EMPTY_PATHOLOGY_FILTERS,
  matchesPathologyFilters,
  PathologyFilters,
  PathologyFilterState,
} from "@/src/components/pathologies/PathologyFilters.tsx";
import {matchesSearch} from "@/src/utils/search.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

/** Onglet « Pathologies » : les maladies (Disease) et les traitements qui les soignent (cure). */
export function PathologiesTab() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PathologyFilterState>(EMPTY_PATHOLOGY_FILTERS);

  const [viewing, setViewing] = useState<DetailTarget | null>(null);
  /** "new" → création, une pathologie → modification */
  const [editing, setEditing] = useState<Disease | "new" | null>(null);
  const [deleting, setDeleting] = useState<Disease | null>(null);

  const load = useCallback(async () => {
    try {
      setDiseases(await getAllDiseases());
    } catch (e) {
      notifyError("Impossible de charger les pathologies", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // La recherche porte aussi sur la description, les approches et les traitements :
  // « tea tree » retrouve les pathologies qu'il soigne, « démangeaisons » celles qui les décrivent.
  const items = useMemo<ResultItem[]>(
    () =>
      diseases
        .filter((d) => {
          const approach = knownApproach(d.approach);
          return (
            matchesPathologyFilters(d, filters) &&
            matchesSearch(search, d.name, d.description, approach && APPROACHES[approach].label, ...d.treatmentNames)
          );
        })
        .map((d) => {
          const approach = knownApproach(d.approach);
          return {
            id: d.id,
            title: d.name,
            // comme la solution d'un traitement : pastille icône + nom à côté du titre
            chip: approach && <ApproachChip approach={approach} />,
            subtitle: d.treatmentNames.length ? d.treatmentNames.join(", ") : "Aucun traitement associé",
          };
        }),
    [diseases, search, filters],
  );

  const find = (id: number) => diseases.find((d) => d.id === id) ?? null;

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteDisease(deleting.id);
      notifySuccess(`« ${deleting.name} » supprimée`);
      setDeleting(null);
      await load();
    } catch (e) {
      notifyError("Suppression impossible", e);
    }
  };

  return (
    <>
      <ResultsContainer
        items={items}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une pathologie, un symptôme ou un traitement"
        onNew={() => setEditing("new")}
        onView={(id) => {
          const d = find(id);
          if (d) setViewing({kind: "disease", id: d.id, name: d.name});
        }}
        onEdit={(id) => setEditing(find(id))}
        onDelete={(id) => setDeleting(find(id))}
        emptyMessage="Aucune pathologie pour l'instant. Crée-en une avec « Nouveau »."
        filters={<PathologyFilters value={filters} onChange={setFilters} />}
        activeFilterCount={countActivePathologyFilters(filters)}
        onResetFilters={() => setFilters(EMPTY_PATHOLOGY_FILTERS)}
      />

      {viewing && (
        <DetailModal initial={viewing} onClose={() => setViewing(null)} onChanged={load} />
      )}

      {editing && (
        <PathologyFormModal
          disease={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          isOpen
          onClose={() => setDeleting(null)}
          title="Supprimer la pathologie"
          message={
            <>
              <p>Supprimer définitivement « {deleting.name} » ?</p>
              {deleting.cureCount > 0 && (
                <p className="text-foreground/60">
                  Ses liens vers {countLabel(deleting.cureCount, "traitement")} seront aussi supprimés
                  (les traitements eux-mêmes sont conservés).
                </p>
              )}
            </>
          }
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
