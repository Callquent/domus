export interface Task {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  icon: string;
  everyDays: number | null; // null ou 0 = tâche non répétitive
  lastDoneAt: string | null; // ISO
  startDate: string | null; // ISO : premier jour où la tâche est à faire (null = tout de suite)
  weekDays: string; // « 1,3 » = lundi et mercredi (0 = dimanche) ; vide = pas de jours fixes
  createdAt: string; // ISO
}

export const CATEGORIES = [
  "Cuisine",
  "Salle de bain",
  "Salon",
  "Chambre",
  "Linge",
  "Sols",
  "Extérieur",
  "Toute la maison",
  "Autre",
];

export interface SubCategory {
  id: string;
  name: string;
  category: string;
  icon: string; // clé de pictogramme (voir components/Icon.tsx)
  custom?: boolean;
}

const sub = (id: string, name: string, category: string, icon: string): SubCategory => ({
  id: `def-${id}`,
  name,
  category,
  icon,
});

export const DEFAULT_SUBCATEGORIES: SubCategory[] = [
  // Cuisine
  sub("four", "Four", "Cuisine", "four"),
  sub("micro-onde", "Micro-onde", "Cuisine", "micro-onde"),
  sub("mettre-table", "Mettre la table", "Cuisine", "table"),
  sub("evier", "Évier", "Cuisine", "evier"),
  sub("plaque", "Plaque de cuisson", "Cuisine", "plaque"),
  sub("frigo", "Frigo", "Cuisine", "frigo"),
  sub("congelateur", "Congélateur", "Cuisine", "congelateur"),
  sub("lave-vaisselle", "Lave-vaisselle", "Cuisine", "lave-vaisselle"),
  sub("sac-poubelle", "Sac poubelle", "Cuisine", "sac-poubelle"),
  // Salle de bain
  sub("douche", "Douche", "Salle de bain", "douche"),
  sub("baignoire", "Baignoire", "Salle de bain", "baignoire"),
  sub("lavabo", "Lavabo", "Salle de bain", "lavabo"),
  sub("toilettes", "Toilettes", "Salle de bain", "toilettes"),
  // Salon
  sub("canape", "Canapé", "Salon", "canape"),
  sub("fauteuil", "Fauteuil", "Salon", "fauteuil"),
  // Chambre
  sub("lit", "Lit", "Chambre", "lit"),
  sub("draps", "Changer les draps", "Chambre", "draps"),
  // Linge
  sub("lave-linge", "Lave-linge", "Linge", "lave-linge"),
  sub("seche-linge", "Sèche-linge", "Linge", "seche-linge"),
  sub("panier-linge", "Panière à linge", "Linge", "panier-linge"),
  sub("repassage", "Table de repassage", "Linge", "repassage"),
  sub("ranger-vetements", "Ranger les vêtements", "Linge", "cintre"),
  // Sols
  sub("aspirateur", "Aspirateur", "Sols", "aspirateur"),
  sub("balai", "Balai", "Sols", "balai"),
  sub("seau", "Seau de nettoyage", "Sols", "seau"),
  // Extérieur
  sub("voiture", "Nettoyage voiture", "Extérieur", "voiture"),
  sub("tondre", "Tondre le jardin", "Extérieur", "tondeuse"),
  // Toute la maison
  sub("aerer", "Aérer", "Toute la maison", "air"),
  sub("vitres", "Nettoyage vitre", "Toute la maison", "vitre"),
  sub("store", "Store", "Toute la maison", "store"),
];

const DAY_MS = 86_400_000;
const NEVER = 99_999; // « échéance » d'une tâche non répétitive déjà faite

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Jours restants avant l'échéance (négatif = en retard). Jamais fait = à faire aujourd'hui. */
export function daysUntilDue(task: Task, now = new Date()): number {
  // Jours fixes de la semaine : prochaine occurrence pas encore faite
  if (isWeekly(task)) {
    return Math.round((pendingWeeklyDate(task, now).getTime() - startOfDay(now)) / DAY_MS);
  }
  // Non répétitive : à faire tant qu'elle n'est pas faite, puis plus jamais
  if (!task.everyDays && task.lastDoneAt) return NEVER;
  if (!task.lastDoneAt) {
    // Jamais faite : à faire dès la date de début (ou tout de suite s'il n'y en a pas)
    return task.startDate
      ? Math.round((startOfDay(new Date(task.startDate)) - startOfDay(now)) / DAY_MS)
      : 0;
  }
  const due = startOfDay(new Date(task.lastDoneAt)) + (task.everyDays ?? 0) * DAY_MS;
  return Math.round((due - startOfDay(now)) / DAY_MS);
}

export function dueLabel(task: Task, now = new Date()): string {
  if (!isRepeating(task) && task.lastDoneAt) return "Terminée";
  const d = daysUntilDue(task, now);
  if (d < 0) return `En retard de ${-d} j`;
  if (d === 0) return isRepeating(task) ? "À faire aujourd'hui" : "À faire";
  const when = addDays(startOfDayDate(now), d).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const notStarted = !task.lastDoneAt && !!task.startDate;
  return notStarted ? `Commence dans ${d} j · ${when}` : `Dans ${d} j · ${when}`;
}

export function lastDoneLabel(task: Task, now = new Date()): string {
  if (!task.lastDoneAt) return "Jamais fait";
  const diff = Math.round(
    (startOfDay(now) - startOfDay(new Date(task.lastDoneAt))) / DAY_MS
  );
  if (diff === 0) return "Fait aujourd'hui";
  if (diff === 1) return "Fait hier";
  return `Fait il y a ${diff} j`;
}

// ---------- Dates & calendrier ----------

export const startOfDayDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** « Catégorie · Sous-catégorie » (la sous-catégorie est omise si elle porte le même nom que la tâche). */
export function taskWhere(t: Pick<Task, "name" | "category" | "subCategory">): string {
  return [t.category, t.subCategory && t.subCategory !== t.name ? t.subCategory : ""]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Jours où la tâche est prévue entre `from` et `to` (inclus), en supposant qu'elle est refaite à l'échéance.
 * Une tâche en retard est ramenée à aujourd'hui. Rien n'est prévu dans le passé.
 */
export function dueDates(task: Task, from: Date, to: Date, now = new Date()): Date[] {
  if (!isRepeating(task) && task.lastDoneAt) return []; // non répétitive déjà faite
  const today = startOfDayDate(now);
  const start = startOfDayDate(from).getTime();
  const end = startOfDayDate(to).getTime();

  if (isWeekly(task)) {
    const wd = weekDaysOf(task);
    const pending = pendingWeeklyDate(task, now);
    const out: Date[] = [];
    // En retard ou à faire aujourd'hui : ramenée à aujourd'hui
    if (pending.getTime() <= today.getTime() && today.getTime() >= start && today.getTime() <= end) {
      out.push(today);
    }
    let d = pending.getTime() > today.getTime() ? pending : addDays(today, 1);
    for (let guard = 0; d.getTime() <= end && guard < 400; guard++) {
      if (d.getTime() >= start && wd.includes(d.getDay())) out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }

  const days = daysUntilDue(task, now);
  const first = days <= 0 ? today : addDays(today, days);

  if (!task.everyDays) {
    // Non répétitive : prévue à la date de début (ou aujourd'hui)
    return first.getTime() >= start && first.getTime() <= end ? [first] : [];
  }

  const out: Date[] = [];
  let d = first;
  for (let guard = 0; d.getTime() <= end && guard < 400; guard++) {
    if (d.getTime() >= start) out.push(d);
    d = addDays(d, Math.max(1, task.everyDays));
  }
  return out;
}

// ---------- Répétition ----------

export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // lundi → dimanche (valeurs de Date.getDay())
export const WEEKDAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
export const WEEKDAY_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const WEEKDAY_PLURAL = ["dimanches", "lundis", "mardis", "mercredis", "jeudis", "vendredis", "samedis"];

/** Jours de la semaine d'une tâche (0 = dimanche … 6 = samedi). */
export const weekDaysOf = (t: Pick<Task, "weekDays">): number[] =>
  (t.weekDays ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number)
    .filter((n, i, a) => Number.isInteger(n) && n >= 0 && n <= 6 && a.indexOf(n) === i);

export const isWeekly = (t: Task) => weekDaysOf(t).length > 0;

/** Répétée (tous les X jours ou certains jours de la semaine). */
export const isRepeating = (t: Task) => isWeekly(t) || (!!t.everyDays && t.everyDays > 0);

/**
 * Prochaine occurrence « jours de la semaine » pas encore faite : le premier jour choisi
 * après la dernière fois faite (ou à partir du début / de la création). Passé = en retard.
 */
export function pendingWeeklyDate(task: Task, now = new Date()): Date {
  const wd = weekDaysOf(task);
  const lower = task.startDate
    ? startOfDayDate(new Date(task.startDate))
    : startOfDayDate(task.createdAt ? new Date(task.createdAt) : now);
  let d = lower;
  if (task.lastDoneAt) {
    const after = addDays(startOfDayDate(new Date(task.lastDoneAt)), 1);
    if (after.getTime() > d.getTime()) d = after;
  }
  for (let i = 0; i < 7; i++) {
    if (wd.includes(d.getDay())) return d;
    d = addDays(d, 1);
  }
  return d;
}

/** « tous les lundis, mercredis » / « tous les 3 j » / « une seule fois » */
export function repeatLabel(t: Task): string {
  const wd = weekDaysOf(t);
  if (wd.length === 7) return "tous les jours";
  if (wd.length > 0) {
    return "tous les " + WEEKDAY_ORDER.filter((d) => wd.includes(d)).map((d) => WEEKDAY_PLURAL[d]).join(", ");
  }
  return t.everyDays ? `tous les ${t.everyDays} j` : "une seule fois";
}

/** Champs saisis dans le formulaire (création et modification). */
export interface TaskInput {
  name: string;
  category: string;
  subCategory: string;
  icon: string;
  everyDays: number | null;
  startDate: string | null;
  weekDays: string;
}

/** Tâche non répétitive déjà faite : terminée pour de bon. */
export const isFinished = (t: Task) => !isRepeating(t) && !!t.lastDoneAt;

export const isDoneToday = (t: Task, now = new Date()) =>
  !!t.lastDoneAt && sameDay(new Date(t.lastDoneAt), now);

// ---------- Champ date (<input type="date">) ----------

export const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** « 2026-11-20 » -> minuit local de ce jour */
export const fromDateInput = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
