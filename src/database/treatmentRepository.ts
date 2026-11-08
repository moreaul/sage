import { getDb } from "@/src/database/db";
import { Treatment, TreatmentInput, TreatmentRow } from "@/src/model/treatment";

const SELECT_TREATMENT = `
  SELECT t.*, ty.name AS type_name, ty.icon AS type_icon
    FROM Treatment t
    LEFT JOIN Treatment_type ty ON ty.id_type = t.id_type`;

/** Chaîne vide → NULL, pour ne pas stocker de champs vides. */
const orNull = (value: string) => value.trim() || null;

export async function getAllTreatments(): Promise<Treatment[]> {
  const rows = await getDb().select<TreatmentRow[]>(
    `${SELECT_TREATMENT} ORDER BY t.name COLLATE NOCASE`,
  );
  return rows.map(Treatment.fromRow);
}

/** Traitements rattachés à une solution (Treatment_type). */
export async function getTreatmentsByType(typeId: number): Promise<Treatment[]> {
  const rows = await getDb().select<TreatmentRow[]>(
    `${SELECT_TREATMENT} WHERE t.id_type = $1 ORDER BY t.name COLLATE NOCASE`,
    [typeId],
  );
  return rows.map(Treatment.fromRow);
}

/** Crée un traitement et renvoie son id. */
export async function createTreatment(input: TreatmentInput): Promise<number> {
  const result = await getDb().execute(
    `INSERT INTO Treatment
       (name, id_type, primary_property, secondary_property, contraindication, description)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      input.name.trim(),
      input.typeId,
      orNull(input.primaryProperty),
      orNull(input.secondaryProperty),
      orNull(input.contraindication),
      orNull(input.description),
    ],
  );
  return result.lastInsertId as number;
}

export async function updateTreatment(id: number, input: TreatmentInput): Promise<void> {
  await getDb().execute(
    `UPDATE Treatment
        SET name = $1, id_type = $2, primary_property = $3,
            secondary_property = $4, contraindication = $5, description = $6
      WHERE id_treatment = $7`,
    [
      input.name.trim(),
      input.typeId,
      orNull(input.primaryProperty),
      orNull(input.secondaryProperty),
      orNull(input.contraindication),
      orNull(input.description),
      id,
    ],
  );
}

/** Nombre de liens qui seront supprimés avec le traitement (pour la confirmation). */
export async function countTreatmentLinks(id: number): Promise<{ cures: number; interactions: number }> {
  const db = getDb();
  const [cures] = await db.select<{ n: number }[]>(
    "SELECT COUNT(*) AS n FROM cure WHERE id_treatment = $1",
    [id],
  );
  const [interactions] = await db.select<{ n: number }[]>(
    "SELECT COUNT(*) AS n FROM interaction WHERE id_treatment = $1 OR id_treatment_1 = $1",
    [id],
  );
  return { cures: cures.n, interactions: interactions.n };
}

/** Supprime le traitement, ses liens vers les pathologies et ses interactions. */
export async function deleteTreatment(id: number): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM cure WHERE id_treatment = $1", [id]);
  await db.execute("DELETE FROM interaction WHERE id_treatment = $1 OR id_treatment_1 = $1", [id]);
  await db.execute("DELETE FROM Treatment WHERE id_treatment = $1", [id]);
}

/**
 * Traitements en interaction avec celui-ci. Une interaction est symétrique :
 * on regarde les deux colonnes de la table.
 */
export async function getInteractions(id: number): Promise<Treatment[]> {
  const rows = await getDb().select<TreatmentRow[]>(
    `${SELECT_TREATMENT}
      WHERE t.id_treatment IN (
        SELECT id_treatment_1 FROM interaction WHERE id_treatment = $1
        UNION
        SELECT id_treatment FROM interaction WHERE id_treatment_1 = $1
      )
      ORDER BY t.name COLLATE NOCASE`,
    [id],
  );
  return rows.map(Treatment.fromRow);
}

/** Toutes les paires de traitements en interaction (la table est petite, on la charge entière). */
export async function getAllInteractionPairs(): Promise<[number, number][]> {
  const rows = await getDb().select<{ id_treatment: number; id_treatment_1: number }[]>(
    "SELECT id_treatment, id_treatment_1 FROM interaction",
  );
  return rows.map((r) => [r.id_treatment, r.id_treatment_1]);
}

/**
 * Parmi les traitements donnés, les paires qui interagissent entre elles.
 * Chaque paire n'apparaît qu'une fois, même si elle est enregistrée dans les deux sens.
 */
export function findInteractingPairs(
  treatmentIds: number[],
  pairs: [number, number][],
): [number, number][] {
  const ids = new Set(treatmentIds);
  const seen = new Set<string>();
  const result: [number, number][] = [];
  for (const [a, b] of pairs) {
    if (!ids.has(a) || !ids.has(b) || a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push([a, b]);
  }
  return result;
}

/** Remplace l'ensemble des interactions du traitement. */
export async function setInteractions(id: number, otherIds: number[]): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM interaction WHERE id_treatment = $1 OR id_treatment_1 = $1", [id]);
  for (const otherId of new Set(otherIds)) {
    if (otherId === id) continue;
    await db.execute(
      "INSERT INTO interaction (id_treatment, id_treatment_1) VALUES ($1, $2)",
      [id, otherId],
    );
  }
}
