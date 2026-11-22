import {useCallback, useEffect, useMemo, useState} from "react";
import ResultsContainer, {ResultItem} from "@/src/components/ResultsContainer.tsx";
import {ConfirmDeleteModal} from "@/src/components/ConfirmDeleteModal.tsx";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {TreatmentFormModal} from "@/src/components/treatments/TreatmentFormModal.tsx";
import {DetailModal, DetailTarget} from "@/src/components/DetailModal.tsx";
import {
  countActiveFilters,
  EMPTY_TREATMENT_FILTERS,
  matchesTreatmentFilters,
  TreatmentFilters,
  TreatmentFilterState,
} from "@/src/components/treatments/TreatmentFilters.tsx";
import {countTreatmentLinks, deleteTreatment, getAllTreatments} from "@/src/database/treatmentRepository.ts";
import {getAllTreatmentTypes} from "@/src/database/treatmentTypeRepository.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";
import {matchesSearch} from "@/src/utils/search.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type PendingDelete = { treatment: Treatment; cures: number; interactions: number };

/** Onglet « Traitements » : CRUD sur la table Treatment. */
export function TreatmentsTab() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [solutions, setSolutions] = useState<TreatmentType[]>([]);
  const [filters, setFilters] = useState<TreatmentFilterState>(EMPTY_TREATMENT_FILTERS);

  const [viewing, setViewing] = useState<DetailTarget | null>(null);
  /** "new" → création, un traitement → modification */
  const [editing, setEditing] = useState<Treatment | "new" | null>(null);
  const [deleting, setDeleting] = useState<PendingDelete | null>(null);

  const load = useCallback(async () => {
    try {
      const [all, types] = await Promise.all([getAllTreatments(), getAllTreatmentTypes()]);
      setTreatments(all);
      setSolutions(types);
    } catch (e) {
      notifyError("Impossible de charger les traitements", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const items = useMemo<ResultItem[]>(
    () =>
      treatments
        .filter(
          (t) =>
            matchesTreatmentFilters(t, filters) &&
            matchesSearch(search, t.name, t.typeName, t.primaryProperty, t.secondaryProperty),
        )
        .map((t) => ({
          id: t.id,
          title: t.name,
          chip: t.typeName ? <SolutionChip name={t.typeName} icon={t.typeIcon} color={t.typeColor} /> : null,
          subtitle: t.primaryProperty,
        })),
    [treatments, search, filters],
  );

  const find = (id: number) => treatments.find((t) => t.id === id) ?? null;

  const askDelete = async (id: number) => {
    const treatment = find(id);
    if (!treatment) return;
    try {
      const links = await countTreatmentLinks(id);
      setDeleting({treatment, ...links});
    } catch (e) {
      notifyError("Impossible de préparer la suppression", e);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteTreatment(deleting.treatment.id);
      notifySuccess(`« ${deleting.treatment.name} » supprimé`);
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
        searchPlaceholder="Rechercher un traitement, une solution, une propriété…"
        onNew={() => setEditing("new")}
        onView={(id) => {
          const t = find(id);
          if (t) setViewing({kind: "treatment", id: t.id, name: t.name});
        }}
        onEdit={(id) => setEditing(find(id))}
        onDelete={askDelete}
        emptyMessage="Aucun traitement pour l'instant. Crée-en un avec « Nouveau »."
        filters={
          <TreatmentFilters
            // solutions utilisées par au moins un traitement (+ celles déjà cochées, pour pouvoir les décocher)
            solutions={solutions.filter((s) => s.treatmentCount > 0 || filters.solutionIds.has(s.id))}
            value={filters}
            onChange={setFilters}
          />
        }
        activeFilterCount={countActiveFilters(filters)}
        onResetFilters={() => setFilters(EMPTY_TREATMENT_FILTERS)}
      />

      {viewing && (
        <DetailModal initial={viewing} onClose={() => setViewing(null)} onChanged={load} />
      )}

      {editing && (
        <TreatmentFormModal
          treatment={editing === "new" ? null : editing}
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
          title="Supprimer le traitement"
          message={
            <>
              <p>Supprimer définitivement « {deleting.treatment.name} » ?</p>
              {(deleting.cures > 0 || deleting.interactions > 0) && (
                <p className="text-foreground/60">
                  Seront aussi supprimés : {countLabel(deleting.cures, "lien", "liens")} vers des pathologies
                  et {countLabel(deleting.interactions, "interaction")}.
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
