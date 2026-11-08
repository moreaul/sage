/** Minuscules + suppression des accents : « Acné » et « acne » se retrouvent. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/** Vrai si la recherche est vide ou si l'un des champs la contient. */
export function matchesSearch(search: string, ...fields: (string | null | undefined)[]): boolean {
  const query = normalize(search);
  if (!query) return true;
  return fields.some((field) => field != null && normalize(field).includes(query));
}

/** Message d'erreur lisible à partir d'une exception quelconque (le plugin SQL renvoie des chaînes). */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
