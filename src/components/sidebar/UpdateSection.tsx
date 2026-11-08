import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress} from "@heroui/react";
import {getVersion} from "@tauri-apps/api/app";
import {relaunch} from "@tauri-apps/plugin-process";
import {check, Update} from "@tauri-apps/plugin-updater";
import {useEffect, useRef, useState} from "react";
import {RefreshIcon} from "@/src/components/icons.tsx";
import {SidebarLabel} from "@/src/components/sidebar/SidebarLabel.tsx";
import {notifyError, notifySuccess} from "@/src/utils/notify.ts";

type DownloadProgress = { downloaded: number; total?: number };

/**
 * Version de l'application et mises à jour : vérification automatique au démarrage
 * (hors mode dev), bouton de vérification manuelle, fenêtre d'installation.
 * Les mises à jour viennent des Releases GitHub (endpoint dans tauri.conf.json).
 */
export function UpdateSection() {
  const [version, setVersion] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);
  /** mise à jour trouvée, en attente de confirmation */
  const [update, setUpdate] = useState<Update | null>(null);
  /** non null pendant le téléchargement / l'installation */
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const autoChecked = useRef(false);

  /** `silent` : pas de toast si tout est à jour ou si la vérification échoue (hors ligne…). */
  const runCheck = async (silent: boolean) => {
    setIsChecking(true);
    try {
      const found = await check();
      if (found) setUpdate(found);
      else if (!silent) notifySuccess("Sage est à jour");
    } catch (e) {
      if (silent) console.warn("Vérification des mises à jour impossible", e);
      else notifyError("Impossible de vérifier les mises à jour", e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    getVersion().then(setVersion).catch(() => {});
    if (import.meta.env.DEV || autoChecked.current) return;
    autoChecked.current = true;
    void runCheck(true);
  }, []);

  const install = async () => {
    if (!update) return;
    setProgress({downloaded: 0});
    try {
      let downloaded = 0;
      let total: number | undefined;
      await update.downloadAndInstall((event) => {
        if (event.event === "Started") total = event.data.contentLength;
        else if (event.event === "Progress") downloaded += event.data.chunkLength;
        setProgress({downloaded, total});
      });
      // Sous Windows l'installeur ferme déjà l'application ; ailleurs on redémarre nous-mêmes.
      await relaunch();
    } catch (e) {
      setProgress(null);
      notifyError("La mise à jour a échoué", e);
    }
  };

  const isInstalling = progress !== null;
  const percent = progress?.total ? Math.round((progress.downloaded / progress.total) * 100) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <SidebarLabel>Application</SidebarLabel>
      <Button
        variant="flat"
        radius="lg"
        className="w-full justify-start font-medium"
        startContent={!isChecking && <RefreshIcon />}
        onPress={() => runCheck(false)}
        isLoading={isChecking}
      >
        Rechercher une mise à jour
      </Button>
      {version && <p className="px-1 text-xs text-foreground/50">Version {version}</p>}

      {update && (
        <Modal isOpen onClose={() => setUpdate(null)} isDismissable={!isInstalling} hideCloseButton={isInstalling} backdrop="blur">
          <ModalContent>
            <ModalHeader>Nouvelle version disponible</ModalHeader>
            <ModalBody className="gap-3 text-sm">
              <p>
                La version <strong>{update.version}</strong> de Sage est disponible (tu as la {update.currentVersion}).
              </p>
              {update.body && (
                <div className="whitespace-pre-line rounded-xl bg-content2 p-3 text-foreground/80">{update.body}</div>
              )}
              {isInstalling ? (
                <Progress
                  aria-label="Téléchargement de la mise à jour"
                  color="primary"
                  size="sm"
                  label={percent === 100 ? "Installation…" : "Téléchargement…"}
                  showValueLabel={percent !== undefined}
                  isIndeterminate={percent === undefined}
                  value={percent}
                />
              ) : (
                <p className="text-foreground/60">Tes données sont conservées. Sage redémarrera tout seul après l'installation.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setUpdate(null)} isDisabled={isInstalling}>
                Plus tard
              </Button>
              <Button color="primary" onPress={install} isLoading={isInstalling}>
                Mettre à jour
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
