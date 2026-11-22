import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@heroui/react";
import {useEffect, useState} from "react";
import {ChevronLeftIcon} from "@/src/components/icons.tsx";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {ApproachChip, knownApproach} from "@/src/components/approaches.tsx";
import {PathologyDetails} from "@/src/components/pathologies/PathologyDetails.tsx";
import {PathologyFormModal} from "@/src/components/pathologies/PathologyFormModal.tsx";
import {TreatmentDetails} from "@/src/components/treatments/TreatmentDetails.tsx";
import {TreatmentFormModal} from "@/src/components/treatments/TreatmentFormModal.tsx";
import {getDiseaseById} from "@/src/database/diseaseRepository.ts";
import {getTreatmentById} from "@/src/database/treatmentRepository.ts";
import {Disease} from "@/src/model/disease.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {notifyError} from "@/src/utils/notify.ts";

/** Une fiche à afficher. Le nom sert de titre pendant le chargement et pour le bouton « Retour ». */
export type DetailTarget = { kind: "disease" | "treatment"; id: number; name: string };

type LoadedEntity =
  | { kind: "disease"; value: Disease }
  | { kind: "treatment"; value: Treatment };

async function loadEntity(target: DetailTarget): Promise<LoadedEntity | null> {
  if (target.kind === "disease") {
    const value = await getDiseaseById(target.id);
    return value && {kind: "disease", value};
  }
  const value = await getTreatmentById(target.id);
  return value && {kind: "treatment", value};
}

type DetailModalProps = {
  /** fiche ouverte en premier */
  initial: DetailTarget;
  onClose: () => void;
  /** appelé après une modification faite depuis la fiche, pour recharger la liste de l'onglet */
  onChanged: () => void;
};

/**
 * Fenêtre « Voir » d'une pathologie ou d'un traitement. Depuis la fiche de départ (celle de l'onglet),
 * on peut ouvrir la fiche d'un traitement lié (traitement d'une pathologie, ou traitement en interaction)
 * dans la même fenêtre, avec un bouton « Retour ». La navigation est volontairement limitée à ce seul niveau : la fiche liée est
 * en lecture seule et ses liens ne sont pas cliquables, pour ne pas perdre l'utilisateur.
 * « Modifier » n'existe que sur la fiche de départ : il ouvre son formulaire, puis y revient.
 */
export function DetailModal({initial, onClose, onChanged}: DetailModalProps) {
  /** fiche de départ ; son nom est mis à jour après une modification */
  const [root, setRoot] = useState<DetailTarget>(initial);
  /** fiche liée ouverte depuis la fiche de départ (un seul niveau) */
  const [linked, setLinked] = useState<DetailTarget | null>(null);
  const [entity, setEntity] = useState<LoadedEntity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  /** incrémenté après une modification pour recharger la fiche courante */
  const [reloadKey, setReloadKey] = useState(0);

  const current = linked ?? root;
  const previous = linked ? root : null;

  /** Ouvre une fiche liée ; sans effet si on est déjà sur une fiche liée. */
  const open = (kind: DetailTarget["kind"], id: number, name: string) => {
    if (!linked) setLinked({kind, id, name});
  };
  const back = () => setLinked(null);

  useEffect(() => {
    let cancelled = false;
    setEntity(null);
    loadEntity(current)
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded) {
          notifyError("Fiche introuvable", `« ${current.name} » a été supprimé.`);
          if (linked) back();
          else onClose();
          return;
        }
        setEntity(loaded);
        // Le nom a pu changer après une modification : on garde le titre et le bouton « Retour » à jour.
        const name = loaded.value.name;
        if (linked) setLinked((l) => l && {...l, name});
        else setRoot((r) => ({...r, name}));
      })
      .catch((e) => {
        if (!cancelled) notifyError("Impossible de charger la fiche", e);
      });
    return () => {
      cancelled = true;
    };
    // On ne recharge que si la fiche affichée change (pas quand seul son nom est mis à jour).
  }, [current.kind, current.id, reloadKey]);

  const afterSave = () => {
    setIsEditing(false);
    setReloadKey((k) => k + 1);
    onChanged();
  };

  if (isEditing && entity) {
    return entity.kind === "disease" ? (
      <PathologyFormModal disease={entity.value} onClose={() => setIsEditing(false)} onSaved={afterSave} />
    ) : (
      <TreatmentFormModal treatment={entity.value} onClose={() => setIsEditing(false)} onSaved={afterSave} />
    );
  }

  const shown = entity && entity.kind === current.kind && entity.value.id === current.id ? entity : null;
  const approach = shown?.kind === "disease" ? knownApproach(shown.value.approach) : null;

  return (
    <Modal isOpen onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col items-start gap-1">
          {previous && (
            <Button
              size="sm"
              variant="light"
              className="-ml-2 h-7 min-w-0 px-2 text-foreground/60"
              startContent={<ChevronLeftIcon width={14} height={14} />}
              onPress={back}
            >
              {previous.name}
            </Button>
          )}
          <div className="flex items-center gap-3">
            {current.name}
            {shown?.kind === "treatment" && shown.value.typeName && (
              <SolutionChip name={shown.value.typeName} icon={shown.value.typeIcon} color={shown.value.typeColor} />
            )}
            {approach && <ApproachChip approach={approach} />}
          </div>
        </ModalHeader>
        {/* La clé remonte le corps à chaque fiche : défilement remis en haut, état réinitialisé. */}
        <ModalBody key={`${current.kind}-${current.id}-${reloadKey}`} className="gap-4">
          {!shown ? (
            <Spinner size="sm" />
          ) : shown.kind === "disease" ? (
            <PathologyDetails
              disease={shown.value}
              onOpenTreatment={linked ? undefined : (id, name) => open("treatment", id, name)}
            />
          ) : (
            <TreatmentDetails
              treatment={shown.value}
              onOpenTreatment={linked ? undefined : (id, name) => open("treatment", id, name)}
            />
          )}
        </ModalBody>
        <ModalFooter className="items-center">
          {previous && (
            <p className="mr-auto text-xs text-foreground/50">
              Pour modifier {current.kind === "disease" ? "cette pathologie" : "ce traitement"}, passe par
              l'onglet « {current.kind === "disease" ? "Pathologies" : "Traitements"} ».
            </p>
          )}
          <Button variant="light" onPress={onClose}>Fermer</Button>
          {/* On ne modifie que la fiche ouverte depuis l'onglet, pas celles atteintes par un lien. */}
          {!previous && (
            <Button color="primary" variant="flat" isDisabled={!shown} onPress={() => setIsEditing(true)}>
              Modifier
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
