import { getDb } from "@/src/database/db";
import { Disease, DiseaseInput, DiseaseRow } from "@/src/model/disease";

/** Toutes les pathologies, avec le nombre et le nom des traitements qui les soignent. */
export async function getAllDiseases(): Promise<Disease[]> {
  const rows = await getDb().select<DiseaseRow[]>(
    `SELECT d.id_disease, d.name, d.description,
            COUNT(c.id_treatment) AS cure_count,
            GROUP_CONCAT(t.name, '||') AS treatment_names
       FROM Disease d
       LEFT JOIN cure c ON c.id_disease = d.id_disease
       LEFT JOIN Treatment t ON t.id_treatment = c.id_treatment
      GROUP BY d.id_disease
      ORDER BY d.name COLLATE NOCASE`,
  );
  return rows.map(Disease.fromRow);
}

/** Crée une pathologie et renvoie son id. */
export async function createDisease(input: DiseaseInput): Promise<number> {
  const result = await getDb().execute(
    "INSERT INTO Disease (name, description) VALUES ($1, $2)",
    [input.name.trim(), input.description.trim() || null],
  );
  return result.lastInsertId as number;
}

export async function updateDisease(id: number, input: DiseaseInput): Promise<void> {
  await getDb().execute(
    "UPDATE Disease SET name = $1, description = $2 WHERE id_disease = $3",
    [input.name.trim(), input.description.trim() || null, id],
  );
}

/** Supprime la pathologie et ses liens vers les traitements (table cure). */
export async function deleteDisease(id: number): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM cure WHERE id_disease = $1", [id]);
  await db.execute("DELETE FROM Disease WHERE id_disease = $1", [id]);
}
