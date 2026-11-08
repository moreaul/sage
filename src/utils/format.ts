/** « Aucun traitement », « 1 traitement », « 3 traitements ». */
export function countLabel(count: number, singular: string, plural = `${singular}s`): string {
  if (count === 0) return `Aucun ${singular}`;
  return `${count} ${count > 1 ? plural : singular}`;
}
