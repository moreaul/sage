export type DiseaseRow = {
  id_disease: number;
  name: string;
  description: string | null;
  /** nombre de traitements liés (table cure), présent seulement dans les requêtes de liste */
  cure_count?: number;
  /** noms des traitements liés séparés par "||", présent seulement dans les requêtes de liste */
  treatment_names?: string | null;
};

/** Champs saisis dans le formulaire de pathologie. */
export type DiseaseInput = {
  name: string;
  description: string;
};

export class Disease {
  constructor(
    public id: number,
    public name: string,
    public description: string | null = null,
    public cureCount = 0,
    public treatmentNames: string[] = [],
  ) {}

  static fromRow(row: DiseaseRow) {
    return new Disease(
      row.id_disease,
      row.name,
      row.description,
      row.cure_count ?? 0,
      row.treatment_names ? row.treatment_names.split("||") : [],
    );
  }
}
