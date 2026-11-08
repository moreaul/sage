import { getDb } from "@/src/database/db";

/**
 * Format du fichier de sauvegarde (JSON). Les lignes reprennent les colonnes de la base
 * telles quelles. Si le schéma évolue, incrémenter BACKUP_FORMAT_VERSION et convertir
 * les anciennes versions dans parseBackup pour que les vieilles sauvegardes restent importables.
 */
export const BACKUP_FORMAT_VERSION = 3;
// Historique :
//  1 — format initial
//  2 — ajout de diseases[].description (absente dans un fichier v1 → NULL)
//  3 — ajout de treatmentTypes[].icon (absente avant → NULL, icône par défaut)

type TreatmentTypeBackup = { id_type: number; name: string; icon: string | null };
type TreatmentBackup = {
  id_treatment: number;
  name: string;
  primary_property: string | null;
  secondary_property: string | null;
  contraindication: string | null;
  id_type: number;
  description: string | null;
};
type DiseaseBackup = { id_disease: number; name: string; description: string | null };
type CureBackup = { id_disease: number; id_treatment: number; usage: string | null };
type InteractionBackup = { id_treatment: number; id_treatment_1: number };

export type BackupData = {
  treatmentTypes: TreatmentTypeBackup[];
  treatments: TreatmentBackup[];
  diseases: DiseaseBackup[];
  cures: CureBackup[];
  interactions: InteractionBackup[];
};

export type BackupFile = {
  app: "sage";
  formatVersion: number;
  exportedAt: string;
  data: BackupData;
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Lit toute la base et construit le contenu du fichier de sauvegarde. */
export async function exportBackup(): Promise<BackupFile> {
  const db = getDb();
  const [treatmentTypes, treatments, diseases, cures, interactions] = await Promise.all([
    db.select<TreatmentTypeBackup[]>("SELECT id_type, name, icon FROM Treatment_type ORDER BY id_type"),
    db.select<TreatmentBackup[]>(
      `SELECT id_treatment, name, primary_property, secondary_property, contraindication, id_type, description
         FROM Treatment ORDER BY id_treatment`,
    ),
    db.select<DiseaseBackup[]>("SELECT id_disease, name, description FROM Disease ORDER BY id_disease"),
    db.select<CureBackup[]>("SELECT id_disease, id_treatment, usage FROM cure ORDER BY id_disease, id_treatment"),
    db.select<InteractionBackup[]>(
      "SELECT id_treatment, id_treatment_1 FROM interaction ORDER BY id_treatment, id_treatment_1",
    ),
  ]);

  return {
    app: "sage",
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: { treatmentTypes, treatments, diseases, cures, interactions },
  };
}

// ---------------------------------------------------------------------------
// Lecture + validation d'un fichier
// ---------------------------------------------------------------------------

class BackupError extends Error {}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function readArray(data: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = data[key];
  if (!Array.isArray(value) || !value.every(isObject)) {
    throw new BackupError(`La section « ${key} » est absente ou invalide.`);
  }
  return value;
}

function readId(row: Record<string, unknown>, key: string, where: string): number {
  const value = row[key];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new BackupError(`${where} : identifiant « ${key} » invalide.`);
  }
  return value;
}

function readName(row: Record<string, unknown>, where: string): string {
  const value = row.name;
  if (typeof value !== "string" || !value.trim()) {
    throw new BackupError(`${where} : nom manquant.`);
  }
  return value;
}

function readOptionalText(row: Record<string, unknown>, key: string, where: string): string | null {
  const value = row[key];
  if (value == null) return null;
  if (typeof value !== "string") throw new BackupError(`${where} : champ « ${key} » invalide.`);
  return value;
}

function assertUnique(keys: string[], what: string) {
  if (new Set(keys).size !== keys.length) {
    throw new BackupError(`Le fichier contient des ${what} en double.`);
  }
}

/**
 * Analyse le texte d'un fichier de sauvegarde. Vérifie tout (types, doublons, liens vers
 * des éléments existants) AVANT l'import, pour que l'écriture en base ne puisse pas échouer
 * à mi-chemin. Lève une erreur au message lisible si le fichier n'est pas valide.
 */
export function parseBackup(text: string): BackupFile {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BackupError("Ce fichier n'est pas une sauvegarde Sage (format illisible).");
  }
  if (!isObject(json) || json.app !== "sage" || !isObject(json.data)) {
    throw new BackupError("Ce fichier n'est pas une sauvegarde Sage.");
  }
  const version = json.formatVersion;
  if (typeof version !== "number" || version > BACKUP_FORMAT_VERSION) {
    throw new BackupError(
      "Cette sauvegarde vient d'une version plus récente de Sage. Mets l'application à jour pour l'importer.",
    );
  }

  const raw = json.data;

  const treatmentTypes = readArray(raw, "treatmentTypes").map((r, i) => {
    const where = `Solution n°${i + 1}`;
    return {
      id_type: readId(r, "id_type", where),
      name: readName(r, where),
      // absente avant la v3 → null (icône par défaut)
      icon: readOptionalText(r, "icon", where),
    };
  });

  const treatments = readArray(raw, "treatments").map((r, i) => {
    const where = `Traitement n°${i + 1}`;
    return {
      id_treatment: readId(r, "id_treatment", where),
      name: readName(r, where),
      primary_property: readOptionalText(r, "primary_property", where),
      secondary_property: readOptionalText(r, "secondary_property", where),
      contraindication: readOptionalText(r, "contraindication", where),
      id_type: readId(r, "id_type", where),
      description: readOptionalText(r, "description", where),
    };
  });

  const diseases = readArray(raw, "diseases").map((r, i) => {
    const where = `Pathologie n°${i + 1}`;
    return {
      id_disease: readId(r, "id_disease", where),
      name: readName(r, where),
      // absente des fichiers v1 → null
      description: readOptionalText(r, "description", where),
    };
  });

  const cures = readArray(raw, "cures").map((r, i) => {
    const where = `Lien pathologie-traitement n°${i + 1}`;
    return {
      id_disease: readId(r, "id_disease", where),
      id_treatment: readId(r, "id_treatment", where),
      usage: readOptionalText(r, "usage", where),
    };
  });

  const interactions = readArray(raw, "interactions").map((r, i) => {
    const where = `Interaction n°${i + 1}`;
    return {
      id_treatment: readId(r, "id_treatment", where),
      id_treatment_1: readId(r, "id_treatment_1", where),
    };
  });

  // Doublons (clés primaires)
  assertUnique(treatmentTypes.map((t) => `${t.id_type}`), "solutions");
  assertUnique(treatments.map((t) => `${t.id_treatment}`), "traitements");
  assertUnique(diseases.map((d) => `${d.id_disease}`), "pathologies");
  assertUnique(cures.map((c) => `${c.id_disease}-${c.id_treatment}`), "liens pathologie-traitement");
  assertUnique(interactions.map((x) => `${x.id_treatment}-${x.id_treatment_1}`), "interactions");

  // Liens vers des éléments présents dans le fichier
  const typeIds = new Set(treatmentTypes.map((t) => t.id_type));
  const treatmentIds = new Set(treatments.map((t) => t.id_treatment));
  const diseaseIds = new Set(diseases.map((d) => d.id_disease));
  if (treatments.some((t) => !typeIds.has(t.id_type))) {
    throw new BackupError("Un traitement fait référence à une solution absente du fichier.");
  }
  if (cures.some((c) => !diseaseIds.has(c.id_disease) || !treatmentIds.has(c.id_treatment))) {
    throw new BackupError("Un lien pathologie-traitement fait référence à un élément absent du fichier.");
  }
  if (interactions.some((x) => !treatmentIds.has(x.id_treatment) || !treatmentIds.has(x.id_treatment_1))) {
    throw new BackupError("Une interaction fait référence à un traitement absent du fichier.");
  }

  return {
    app: "sage",
    formatVersion: version,
    exportedAt: typeof json.exportedAt === "string" ? json.exportedAt : "",
    data: { treatmentTypes, treatments, diseases, cures, interactions },
  };
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/** Littéral SQL : NULL, entier, ou texte entre apostrophes (les ' sont doublées). */
function sql(value: string | number | null): string {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(Math.trunc(value));
  return `'${value.replace(/'/g, "''")}'`;
}

function insert(table: string, columns: string[], rows: Record<string, string | number | null>[]): string {
  return rows
    .map(
      (row) =>
        `INSERT OR ROLLBACK INTO ${table} (${columns.join(", ")}) VALUES (${columns.map((c) => sql(row[c])).join(", ")});`,
    )
    .join("\n");
}

/**
 * Remplace TOUTES les données par celles de la sauvegarde.
 *
 * Tout est envoyé en un seul script, donc exécuté sur une seule connexion, dans une
 * transaction : soit tout est remplacé, soit rien ne change. Les valeurs sont écrites
 * en littéraux SQL échappés (impossible de « binder » des paramètres dans un script à
 * plusieurs requêtes). `INSERT OR ROLLBACK` annule la transaction en cas de conflit.
 */
export async function importBackup(backup: BackupFile): Promise<void> {
  const { treatmentTypes, treatments, diseases, cures, interactions } = backup.data;
  const script = [
    "BEGIN;",
    "DELETE FROM interaction;",
    "DELETE FROM cure;",
    "DELETE FROM Treatment;",
    "DELETE FROM Disease;",
    "DELETE FROM Treatment_type;",
    insert("Treatment_type", ["id_type", "name", "icon"], treatmentTypes),
    insert(
      "Treatment",
      ["id_treatment", "name", "primary_property", "secondary_property", "contraindication", "id_type", "description"],
      treatments,
    ),
    insert("Disease", ["id_disease", "name", "description"], diseases),
    insert("cure", ["id_disease", "id_treatment", "usage"], cures),
    insert("interaction", ["id_treatment", "id_treatment_1"], interactions),
    "COMMIT;",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await getDb().execute(script);
  } catch (error) {
    // Erreur imprévue au milieu du script : on tente d'annuler la transaction restée ouverte.
    // (Peut échouer si le pool fournit une autre connexion, d'où le catch silencieux.)
    await getDb().execute("ROLLBACK;").catch(() => {});
    throw error;
  }
}

/** Résumé lisible du contenu d'une sauvegarde, pour la confirmation. */
export function describeBackup(backup: BackupFile) {
  const d = backup.data;
  const date = backup.exportedAt ? new Date(backup.exportedAt) : null;
  return {
    date: date && !isNaN(date.getTime())
      ? date.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
      : null,
    diseases: d.diseases.length,
    treatments: d.treatments.length,
    solutions: d.treatmentTypes.length,
  };
}
