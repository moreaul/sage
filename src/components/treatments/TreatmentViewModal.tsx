import {Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@heroui/react";
import {SolutionChip} from "@/src/components/SolutionChip.tsx";
import {useEffect, useState} from "react";
import {DetailField, SectionTitle} from "@/src/components/DetailField.tsx";
import {WarningIcon} from "@/src/components/icons.tsx";
import {getCuresForTreatment} from "@/src/database/cureRepository.ts";
import {getInteractions} from "@/src/database/treatmentRepository.ts";
import {Cure} from "@/src/model/cure.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {notifyError} from "@/src/utils/notify.ts";

type TreatmentViewModalProps = {
  treatment: Treatment;
  onClose: () => void;
  onEdit: () => void;
};

export function TreatmentViewModal({treatment, onClose, onEdit}: TreatmentViewModalProps) {
  const [cures, setCures] = useState<Cure[] | null>(null);
  const [interactions, setInteractions] = useState<Treatment[] | null>(null);

  useEffect(() => {
    Promise.all([getCuresForTreatment(treatment.id), getInteractions(treatment.id)])
      .then(([c, i]) => {
        setCures(c);
        setInteractions(i);
      })
      .catch((e) => {
        notifyError("Impossible de charger la fiche", e);
        setCures([]);
        setInteractions([]);
      });
  }, [treatment.id]);

  return (
    <Modal isOpen onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          {treatment.name}
          {treatment.typeName && (
            <SolutionChip name={treatment.typeName} icon={treatment.typeIcon} />
          )}
        </ModalHeader>
        <ModalBody className="gap-4">
          <DetailField label="Propriété principale">{treatment.primaryProperty}</DetailField>
          <DetailField label="Propriété secondaire">{treatment.secondaryProperty}</DetailField>
          <DetailField label="Description">{treatment.description}</DetailField>

          {treatment.contraindication && (
            <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3">
              <WarningIcon className="mt-0.5 shrink-0 text-warning" />
              <DetailField label="Contre-indications">{treatment.contraindication}</DetailField>
            </div>
          )}

          <SectionTitle>Interactions</SectionTitle>
          {interactions == null ? (
            <Spinner size="sm" />
          ) : interactions.length === 0 ? (
            <p className="text-sm text-foreground/60">Aucune interaction connue.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interactions.map((t) => (
                <Chip key={t.id} variant="flat" color="warning">{t.name}</Chip>
              ))}
            </div>
          )}

          <SectionTitle>Pathologies soignées</SectionTitle>
          {cures == null ? (
            <Spinner size="sm" />
          ) : cures.length === 0 ? (
            <p className="text-sm text-foreground/60">
              Ce traitement n'est encore associé à aucune pathologie (l'association se fait depuis l'onglet « Pathologies »).
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {cures.map((c) => (
                <li key={c.diseaseId} className="rounded-xl bg-content2 px-3 py-2">
                  <div className="text-sm font-medium">{c.diseaseName}</div>
                  {c.usage && <div className="text-xs text-foreground/70 whitespace-pre-line">{c.usage}</div>}
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
