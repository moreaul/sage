import {invoke} from "@tauri-apps/api/core";
import {open, save} from "@tauri-apps/plugin-dialog";
import {BackupFile, exportBackup, parseBackup} from "@/src/database/backupRepository.ts";

const FILTERS = [{name: "Sauvegarde Sage", extensions: ["json"]}];

/**
 * Demande où enregistrer puis écrit la sauvegarde.
 * Renvoie false si l'utilisateur a annulé la boîte de dialogue.
 */
export async function exportToFile(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const path = await save({
    title: "Enregistrer la sauvegarde",
    defaultPath: `sage-sauvegarde-${today}.json`,
    filters: FILTERS,
  });
  if (!path) return false;

  const backup = await exportBackup();
  await invoke("write_backup_file", {path, contents: JSON.stringify(backup, null, 2)});
  return true;
}

/**
 * Demande un fichier puis le lit et le valide (sans rien importer).
 * Renvoie null si l'utilisateur a annulé ; lève une erreur lisible si le fichier est invalide.
 */
export async function pickBackupFile(): Promise<BackupFile | null> {
  const path = await open({
    title: "Choisir une sauvegarde à importer",
    multiple: false,
    directory: false,
    filters: FILTERS,
  });
  if (!path) return null;

  const text = await invoke<string>("read_backup_file", {path});
  return parseBackup(text);
}
