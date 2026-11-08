import { getDb } from "@/src/database/db";
import { Cure, CureRow } from "@/src/model/cure";

/** Traitements qui soignent une pathologie, avec leur usage. */
export async function getCuresForDisease(diseaseId: number): Promise<Cure[]> {
  const rows = await getDb().select<CureRow[]>(
    `SELECT c.id_disease, c.id_treatment, c.usage,
            t.name AS treatment_name, t.contraindication, ty.name AS type_name, ty.icon AS type_icon
       FROM cure c
       JOIN Treatment t ON t.id_treatment = c.id_treatment
       LEFT JOIN Treatment_type ty ON ty.id_type = t.id_type
      WHERE c.id_disease = $1
      ORDER BY t.name COLLATE NOCASE`,
    [diseaseId],
  );
  return rows.map(Cure.fromRow);
}

/** Pathologies soignées par un traitement, avec l'usage. */
export async function getCuresForTreatment(treatmentId: number): Promise<Cure[]> {
  const rows = await getDb().select<CureRow[]>(
    `SELECT c.id_disease, c.id_treatment, c.usage, d.name AS disease_name
       FROM cure c
       JOIN Disease d ON d.id_disease = c.id_disease
      WHERE c.id_treatment = $1
      ORDER BY d.name COLLATE NOCASE`,
    [treatmentId],
  );
  return rows.map(Cure.fromRow);
}

/** Remplace l'ensemble des traitements liés à une pathologie. */
export async function setCuresForDisease(
  diseaseId: number,
  cures: { treatmentId: number; usage: string }[],
): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM cure WHERE id_disease = $1", [diseaseId]);
  for (const cure of cures) {
    await db.execute(
      "INSERT INTO cure (id_disease, id_treatment, usage) VALUES ($1, $2, $3)",
      [diseaseId, cure.treatmentId, cure.usage.trim() || null],
    );
  }
}
