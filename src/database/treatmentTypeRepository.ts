import { getDb } from "@/src/database/db";
import { TreatmentType, TreatmentTypeInput, TreatmentTypeRow } from "@/src/model/treatmentType";

/** Toutes les solutions, avec le nombre de traitements de chacune. */
export async function getAllTreatmentTypes(): Promise<TreatmentType[]> {
  const rows = await getDb().select<TreatmentTypeRow[]>(
    `SELECT ty.id_type, ty.name, ty.icon, COUNT(t.id_treatment) AS treatment_count
       FROM Treatment_type ty
       LEFT JOIN Treatment t ON t.id_type = ty.id_type
      GROUP BY ty.id_type
      ORDER BY ty.name COLLATE NOCASE`,
  );
  return rows.map(TreatmentType.fromRow);
}

/** Crée une solution et renvoie son id. */
export async function createTreatmentType(input: TreatmentTypeInput): Promise<number> {
  const result = await getDb().execute(
    "INSERT INTO Treatment_type (name, icon) VALUES ($1, $2)",
    [input.name.trim(), input.icon],
  );
  return result.lastInsertId as number;
}

export async function updateTreatmentType(id: number, input: TreatmentTypeInput): Promise<void> {
  await getDb().execute(
    "UPDATE Treatment_type SET name = $1, icon = $2 WHERE id_type = $3",
    [input.name.trim(), input.icon, id],
  );
}

/**
 * Supprime une solution. Refusé si des traitements l'utilisent encore :
 * chaque traitement doit obligatoirement avoir une solution (id_type NOT NULL).
 */
export async function deleteTreatmentType(id: number): Promise<void> {
  const db = getDb();
  const [{ n }] = await db.select<{ n: number }[]>(
    "SELECT COUNT(*) AS n FROM Treatment WHERE id_type = $1",
    [id],
  );
  if (n > 0) {
    throw new Error(`Cette solution est encore utilisée par ${n} traitement(s).`);
  }
  await db.execute("DELETE FROM Treatment_type WHERE id_type = $1", [id]);
}
