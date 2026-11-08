import {useCallback, useEffect, useMemo, useState} from "react";
import ResultsContainer, {ResultItem} from "@/src/components/ResultsContainer.tsx";
import {ConfirmDeleteModal} from "@/src/components/ConfirmDeleteModal.tsx";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {TreatmentFormModal} from "@/src/components/treatments/TreatmentFormModal.tsx";
import {TreatmentViewModal} from "@/src/components/treatments/TreatmentViewModal.tsx";
import {countTreatmentLinks, deleteTreatment, getAllTreatments} from "@/src/database/treatmentRepository.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {matchesSearch} from "@/src/utils/search.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type PendingDelete = { treatment: Treatment; cures: number; interactions: number };

/** Onglet « Traitements » : CRUD sur la table Treatment. */
export function TreatmentsTab() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [viewing, setViewing] = useState<Treatment | null>(null);
  /** "new" → création, un traitement → modification */
  const [editing, setEditing] = useState<Treatment | "new" | null>(null);
  const [deleting, setDeleting] = useState<PendingDelete | null>(null);

  const load = useCallback(async () => {
    try {
      setTreatments(await getAllTreatments());
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
        .filter((t) =>
          matchesSearch(search, t.name, t.typeName, t.primaryProperty, t.secondaryProperty),
        )
        .map((t) => ({
          id: t.id,
          title: t.name,
          chip: t.typeName ? <SolutionChip name={t.typeName} icon={t.typeIcon} /> : null,
          subtitle: t.primaryProperty,
        })),
    [treatments, search],
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
        onView={(id) => setViewing(find(id))}
        onEdit={(id) => setEditing(find(id))}
        onDelete={askDelete}
        emptyMessage="Aucun traitement pour l'instant. Crée-en un avec « Nouveau »."
      />

      {viewing && (
        <TreatmentViewModal
          treatment={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
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
