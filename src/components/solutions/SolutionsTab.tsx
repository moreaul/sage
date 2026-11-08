import {useCallback, useEffect, useMemo, useState} from "react";
import ResultsContainer, {ResultItem} from "@/src/components/ResultsContainer.tsx";
import {ConfirmDeleteModal} from "@/src/components/ConfirmDeleteModal.tsx";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";
import {SolutionFormModal} from "@/src/components/solutions/SolutionFormModal.tsx";
import {SolutionViewModal} from "@/src/components/solutions/SolutionViewModal.tsx";
import {deleteTreatmentType, getAllTreatmentTypes} from "@/src/database/treatmentTypeRepository.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";
import {matchesSearch} from "@/src/utils/search.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

/** Onglet « Solutions » : les catégories de traitements (Treatment_type). */
export function SolutionsTab() {
  const [solutions, setSolutions] = useState<TreatmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [viewing, setViewing] = useState<TreatmentType | null>(null);
  /** "new" → création, une solution → modification */
  const [editing, setEditing] = useState<TreatmentType | "new" | null>(null);
  const [deleting, setDeleting] = useState<TreatmentType | null>(null);

  const load = useCallback(async () => {
    try {
      setSolutions(await getAllTreatmentTypes());
    } catch (e) {
      notifyError("Impossible de charger les solutions", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const items = useMemo<ResultItem[]>(
    () =>
      solutions
        .filter((s) => matchesSearch(search, s.name))
        .map((s) => ({
          id: s.id,
          title: s.name,
          leading: <SolutionIcon icon={s.icon} size={22} />,
          subtitle: countLabel(s.treatmentCount, "traitement"),
        })),
    [solutions, search],
  );

  const find = (id: number) => solutions.find((s) => s.id === id) ?? null;

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteTreatmentType(deleting.id);
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
        searchPlaceholder="Rechercher une solution"
        onNew={() => setEditing("new")}
        onView={(id) => setViewing(find(id))}
        onEdit={(id) => setEditing(find(id))}
        onDelete={(id) => setDeleting(find(id))}
        emptyMessage="Aucune solution pour l'instant. Crée-en une avec « Nouveau » (ex. Huile essentielle)."
      />

      {viewing && (
        <SolutionViewModal
          solution={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
      )}

      {editing && (
        <SolutionFormModal
          solution={editing === "new" ? null : editing}
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
          title="Supprimer la solution"
          message={
            deleting.treatmentCount > 0 ? (
              <p>
                « {deleting.name} » est utilisée par {countLabel(deleting.treatmentCount, "traitement")}.
                Change la solution de ces traitements (ou supprime-les) avant de supprimer celle-ci.
              </p>
            ) : (
              <p>Supprimer définitivement « {deleting.name} » ?</p>
            )
          }
          onConfirm={deleting.treatmentCount > 0 ? undefined : confirmDelete}
        />
      )}
    </>
  );
}
