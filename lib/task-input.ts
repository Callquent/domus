export interface TaskData {
  name: string;
  category: string;
  subCategory: string;
  icon: string;
  everyDays: number; // 0 = pas de répétition « tous les X jours »
  startDate: Date | null;
  weekDays: string; // « 1,3 » ; vide = aucun
}

/** Valide et normalise le corps d'une requête de création / modification de tâche. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseTaskInput(body: any): { data: TaskData } | { error: string } {
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return { error: "Données invalides" };

  const e = body.everyDays;
  const wantsInterval = e !== null && e !== undefined && e !== 0;
  if (wantsInterval && (!Number.isInteger(e) || e < 1)) return { error: "Fréquence invalide" };

  const rawDays: unknown[] = Array.isArray(body.weekDays)
    ? body.weekDays
    : typeof body.weekDays === "string"
    ? body.weekDays.split(",").filter(Boolean)
    : [];
  const days = Array.from(new Set(rawDays.map(Number)))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
    .sort((a, b) => a - b);

  const start = body.startDate ? new Date(body.startDate) : null;
  if (start && isNaN(start.getTime())) return { error: "Date de début invalide" };

  return {
    data: {
      name,
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : "Général",
      subCategory: typeof body.subCategory === "string" ? body.subCategory.trim() : "",
      icon: typeof body.icon === "string" && body.icon ? body.icon : "etoile",
      everyDays: days.length > 0 ? 0 : wantsInterval ? e : 0,
      startDate: start,
      weekDays: days.join(","),
    },
  };
}
