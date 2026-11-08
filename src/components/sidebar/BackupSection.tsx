import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {useState} from "react";
import {DownloadIcon, UploadIcon, WarningIcon} from "@/src/components/icons.tsx";
import {SidebarLabel} from "@/src/components/sidebar/SidebarLabel.tsx";
import {BackupFile, describeBackup, importBackup} from "@/src/database/backupRepository.ts";
import {exportToFile, pickBackupFile} from "@/src/utils/backupFile.ts";
import {countLabel} from "@/src/utils/format.ts";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type BackupSectionProps = {
  /** appelé après un import réussi, pour recharger l'affichage */
  onImported: () => void;
};

/** Boutons d'export / import de toutes les données dans un fichier JSON. */
export function BackupSection({onImported}: BackupSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  /** sauvegarde lue et validée, en attente de confirmation */
  const [pending, setPending] = useState<BackupFile | null>(null);

  const doExport = async () => {
    setIsExporting(true);
    try {
      if (await exportToFile()) notifySuccess("Sauvegarde enregistrée");
    } catch (e) {
      notifyError("La sauvegarde a échoué", e);
    } finally {
      setIsExporting(false);
    }
  };

  const pick = async () => {
    setIsPicking(true);
    try {
      const backup = await pickBackupFile();
      if (backup) setPending(backup);
    } catch (e) {
      notifyError("Impossible d'utiliser ce fichier", e);
    } finally {
      setIsPicking(false);
    }
  };

  const confirmImport = async () => {
    if (!pending) return;
    setIsImporting(true);
    try {
      await importBackup(pending);
      setPending(null);
      notifySuccess("Sauvegarde importée");
      onImported();
    } catch (e) {
      notifyError("L'import a échoué, tes données n'ont pas été modifiées", e);
    } finally {
      setIsImporting(false);
    }
  };

  const summary = pending ? describeBackup(pending) : null;

  return (
    <div className="flex flex-col gap-2">
      <SidebarLabel>Sauvegarde</SidebarLabel>
      <Button
        color="primary"
        variant="flat"
        radius="lg"
        className="w-full justify-start font-medium"
        startContent={!isExporting && <UploadIcon />}
        onPress={doExport}
        isLoading={isExporting}
      >
        Exporter mes données
      </Button>
      <Button
        color="primary"
        variant="flat"
        radius="lg"
        className="w-full justify-start font-medium"
        startContent={!isPicking && <DownloadIcon />}
        onPress={pick}
        isLoading={isPicking}
      >
        Importer une sauvegarde
      </Button>
      <p className="px-1 text-xs leading-relaxed text-foreground/50">
        Garde le fichier exporté sur un Drive ou une clé USB : il permet de tout retrouver sur un autre ordinateur.
      </p>

      {pending && summary && (
        <Modal isOpen onClose={() => setPending(null)} isDismissable={!isImporting} backdrop="blur">
          <ModalContent>
            <ModalHeader>Importer cette sauvegarde ?</ModalHeader>
            <ModalBody className="gap-3 text-sm">
              <div className="rounded-xl bg-content2 p-3">
                {summary.date && <p className="font-medium">Sauvegarde du {summary.date}</p>}
                <p className="text-foreground/70">
                  {countLabel(summary.diseases, "pathologie")}, {countLabel(summary.treatments, "traitement")},{" "}
                  {countLabel(summary.solutions, "solution")}
                </p>
              </div>
              <div className="flex gap-3 rounded-xl border border-danger/40 bg-danger/10 p-3">
                <WarningIcon className="mt-0.5 shrink-0 text-danger" />
                <p>
                  Toutes les données actuelles seront <strong>remplacées</strong> par celles de ce fichier.
                  Si tu as fait des changements depuis cette sauvegarde, exporte d'abord tes données actuelles.
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="flex-wrap">
              <Button variant="light" onPress={() => setPending(null)} isDisabled={isImporting}>
                Annuler
              </Button>
              <Button variant="flat" onPress={doExport} isLoading={isExporting} isDisabled={isImporting}>
                Exporter d'abord
              </Button>
              <Button color="danger" onPress={confirmImport} isLoading={isImporting}>
                Remplacer mes données
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
