import {useCallback, useEffect, useMemo, useState} from "react";
import ResultsContainer, {ResultItem} from "@/src/components/ResultsContainer.tsx";
import {ConfirmDeleteModal} from "@/src/components/ConfirmDeleteModal.tsx";
import {PathologyFormModal} from "@/src/components/pathologies/PathologyFormModal.tsx";
import {PathologyViewModal} from "@/src/components/pathologies/PathologyViewModal.tsx";
import {deleteDisease, getAllDiseases} from "@/src/database/diseaseRepository.ts";
import {Disease} from "@/src/model/disease.ts";
import {matchesSearch} from "@/src/utils/search.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

/** Onglet « Pathologies » : les maladies (Disease) et les traitements qui les soignent (cure). */
export function PathologiesTab() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [viewing, setViewing] = useState<Disease | null>(null);
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

  // La recherche porte aussi sur la description et les traitements :
  // « tea tree » retrouve les pathologies qu'il soigne, « démangeaisons » celles qui les décrivent.
  const items = useMemo<ResultItem[]>(
    () =>
      diseases
        .filter((d) => matchesSearch(search, d.name, d.description, ...d.treatmentNames))
        .map((d) => ({
          id: d.id,
          title: d.name,
          subtitle: d.treatmentNames.length ? d.treatmentNames.join(", ") : "Aucun traitement associé",
        })),
    [diseases, search],
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
        onView={(id) => setViewing(find(id))}
        onEdit={(id) => setEditing(find(id))}
        onDelete={(id) => setDeleting(find(id))}
        emptyMessage="Aucune pathologie pour l'instant. Crée-en une avec « Nouveau »."
      />

      {viewing && (
        <PathologyViewModal
          disease={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
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
