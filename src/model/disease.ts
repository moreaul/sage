export type DiseaseRow = {
  id_disease: number;
  name: string;
  description: string | null;
  /** clé de l'approche (voir src/components/approaches.tsx), ou null */
  approach: string | null;
  /** nombre de traitements liés (table cure), présent seulement dans les requêtes de liste */
  cure_count?: number;
  /** noms des traitements liés séparés par "||", présent seulement dans les requêtes de liste */
  treatment_names?: string | null;
};

/** Champs saisis dans le formulaire de pathologie. */
export type DiseaseInput = {
  name: string;
  description: string;
  /** clé de l'approche, ou null */
  approach: string | null;
};

export class Disease {
  constructor(
    public id: number,
    public name: string,
    public description: string | null = null,
    public cureCount = 0,
    public treatmentNames: string[] = [],
    /** clé de l'approche telle qu'en base (voir src/components/approaches.tsx), ou null */
    public approach: string | null = null,
  ) {}

  static fromRow(row: DiseaseRow) {
    return new Disease(
      row.id_disease,
      row.name,
      row.description,
      row.cure_count ?? 0,
      row.treatment_names ? row.treatment_names.split("||") : [],
      row.approach,
    );
  }
}
