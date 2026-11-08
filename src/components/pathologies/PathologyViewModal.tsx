import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@heroui/react";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {useEffect, useMemo, useState} from "react";
import {DetailField, SectionTitle} from "@/src/components/DetailField.tsx";
import {WarningIcon} from "@/src/components/icons.tsx";
import {InteractionWarning} from "@/src/components/InteractionWarning.tsx";
import {getCuresForDisease} from "@/src/database/cureRepository.ts";
import {findInteractingPairs, getAllInteractionPairs} from "@/src/database/treatmentRepository.ts";
import {Cure} from "@/src/model/cure.ts";
import {Disease} from "@/src/model/disease.ts";
import {notifyError} from "@/src/utils/notify.ts";

type PathologyViewModalProps = {
  disease: Disease;
  onClose: () => void;
  onEdit: () => void;
};

export function PathologyViewModal({disease, onClose, onEdit}: PathologyViewModalProps) {
  const [cures, setCures] = useState<Cure[] | null>(null);
  const [interactionPairs, setInteractionPairs] = useState<[number, number][]>([]);

  useEffect(() => {
    Promise.all([getCuresForDisease(disease.id), getAllInteractionPairs()])
      .then(([c, pairs]) => {
        setCures(c);
        setInteractionPairs(pairs);
      })
      .catch((e) => {
        notifyError("Impossible de charger les traitements", e);
        setCures([]);
      });
  }, [disease.id]);

  const conflicts = useMemo(
    () => findInteractingPairs((cures ?? []).map((c) => c.treatmentId), interactionPairs),
    [cures, interactionPairs],
  );
  const nameOf = (id: number) => cures?.find((c) => c.treatmentId === id)?.treatmentName ?? "?";

  return (
    <Modal isOpen onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader>{disease.name}</ModalHeader>
        <ModalBody className="gap-3">
          <DetailField label="Description">{disease.description}</DetailField>
          <InteractionWarning pairs={conflicts} nameOf={nameOf} />
          <SectionTitle>Traitements</SectionTitle>
          {cures == null ? (
            <Spinner size="sm" />
          ) : cures.length === 0 ? (
            <p className="text-sm text-foreground/60">
              Aucun traitement associé. Clique sur « Modifier » pour en ajouter.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {cures.map((c) => (
                <li key={c.treatmentId} className="flex flex-col gap-2 rounded-xl bg-content2 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.treatmentName}</span>
                    {c.typeName && <SolutionChip name={c.typeName} icon={c.typeIcon} />}
                  </div>
                  {c.usage ? (
                    <DetailField label="Mode d'utilisation">{c.usage}</DetailField>
                  ) : (
                    <p className="text-xs text-foreground/50">Mode d'utilisation non renseigné.</p>
                  )}
                  {c.contraindication && (
                    <p className="flex items-start gap-2 text-xs text-warning">
                      <WarningIcon width={14} height={14} className="mt-0.5 shrink-0" />
                      <span className="whitespace-pre-line">{c.contraindication}</span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Fermer</Button>
          <Button color="primary" variant="flat" onPress={onEdit}>Modifier</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
