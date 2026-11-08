/** Une « solution » dans l'interface : catégorie de traitement (ex. Huile essentielle). */
export type TreatmentTypeRow = {
  id_type: number;
  name: string;
  /** clé d'icône (voir src/components/solutionIcons.tsx) */
  icon: string | null;
  /** nombre de traitements de ce type, présent seulement dans les requêtes de liste */
  treatment_count?: number;
};

/** Champs saisis dans le formulaire de solution. */
export type TreatmentTypeInput = {
  name: string;
  icon: string | null;
};

export class TreatmentType {
  constructor(
    public id: number,
    public name: string,
    public icon: string | null = null,
    public treatmentCount = 0,
  ) {}

  static fromRow(row: TreatmentTypeRow) {
    return new TreatmentType(row.id_type, row.name, row.icon, row.treatment_count ?? 0);
  }
}
