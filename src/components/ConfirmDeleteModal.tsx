import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {ReactNode, useState} from "react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: ReactNode;
  /** absent → suppression impossible : seul le bouton « Fermer » est affiché */
  onConfirm?: () => Promise<void>;
};

export function ConfirmDeleteModal({isOpen, onClose, title, message, onConfirm}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirm = async () => {
    if (!onConfirm) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={!isDeleting} backdrop="blur">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody className="text-sm text-foreground/80">{message}</ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isDeleting}>
            {onConfirm ? "Annuler" : "Fermer"}
          </Button>
          {onConfirm && (
            <Button color="danger" onPress={confirm} isLoading={isDeleting}>
              Supprimer
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
