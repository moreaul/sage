export type TreatmentRow = {
  id_treatment: number;
  name: string;
  primary_property: string | null;
  secondary_property: string | null;
  contraindication: string | null;
  id_type: number;
  description: string | null;
  /** nom de la solution (Treatment_type), présent quand la requête fait la jointure */
  type_name?: string | null;
  /** icône de la solution, présente quand la requête fait la jointure */
  type_icon?: string | null;
};

/** Champs saisis dans le formulaire de traitement. */
export type TreatmentInput = {
  name: string;
  typeId: number;
  primaryProperty: string;
  secondaryProperty: string;
  contraindication: string;
  description: string;
};

export class Treatment {
  constructor(
    public id: number,
    public name: string,
    public typeId: number,
    public typeName: string | null,
    public primaryProperty: string | null,
    public secondaryProperty: string | null,
    public contraindication: string | null,
    public description: string | null,
    public typeIcon: string | null = null,
  ) {}

  static fromRow(row: TreatmentRow) {
    return new Treatment(
      row.id_treatment,
      row.name,
      row.id_type,
      row.type_name ?? null,
      row.primary_property,
      row.secondary_property,
      row.contraindication,
      row.description,
      row.type_icon ?? null,
    );
  }
}
