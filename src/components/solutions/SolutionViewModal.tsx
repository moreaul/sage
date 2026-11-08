import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@heroui/react";
import {useEffect, useState} from "react";
import {SectionTitle} from "@/src/components/DetailField.tsx";
import {SolutionIcon} from "@/src/components/solutionIcons.tsx";
import {getTreatmentsByType} from "@/src/database/treatmentRepository.ts";
import {Treatment} from "@/src/model/treatment.ts";
import {TreatmentType} from "@/src/model/treatmentType.ts";
import {notifyError} from "@/src/utils/notify.ts";

type SolutionViewModalProps = {
  solution: TreatmentType;
  onClose: () => void;
  onEdit: () => void;
};

export function SolutionViewModal({solution, onClose, onEdit}: SolutionViewModalProps) {
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);

  useEffect(() => {
    getTreatmentsByType(solution.id)
      .then(setTreatments)
      .catch((e) => {
        notifyError("Impossible de charger les traitements", e);
        setTreatments([]);
      });
  }, [solution.id]);

  return (
    <Modal isOpen onClose={onClose} size="lg" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <SolutionIcon icon={solution.icon} size={22} />
          </div>
          {solution.name}
        </ModalHeader>
        <ModalBody>
          <SectionTitle>Traitements de cette solution</SectionTitle>
          {treatments == null ? (
            <Spinner size="sm" />
          ) : treatments.length === 0 ? (
            <p className="text-sm text-foreground/60">Aucun traitement n'utilise encore cette solution.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {treatments.map((t) => (
                <li key={t.id} className="rounded-xl bg-content2 px-3 py-2">
                  <div className="text-sm font-medium">{t.name}</div>
                  {t.primaryProperty && (
                    <div className="text-xs text-foreground/60">{t.primaryProperty}</div>
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
