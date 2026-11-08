/** Lien « ce traitement soigne cette pathologie », avec son usage (posologie, mode d'emploi…). */
export type CureRow = {
  id_disease: number;
  id_treatment: number;
  usage: string | null;
  disease_name?: string;
  treatment_name?: string;
  type_name?: string | null;
  type_icon?: string | null;
  contraindication?: string | null;
};

export class Cure {
  constructor(
    public diseaseId: number,
    public treatmentId: number,
    public usage: string | null,
    public diseaseName = "",
    public treatmentName = "",
    public typeName: string | null = null,
    public contraindication: string | null = null,
    public typeIcon: string | null = null,
  ) {}

  static fromRow(row: CureRow) {
    return new Cure(
      row.id_disease,
      row.id_treatment,
      row.usage,
      row.disease_name ?? "",
      row.treatment_name ?? "",
      row.type_name ?? null,
      row.contraindication ?? null,
      row.type_icon ?? null,
    );
  }
}
