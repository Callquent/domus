// Dates fournies à l'application « Agenda » (voir app/api/agenda/route.ts).
import { dueDates, daysUntilDue, type Task } from "./tasks";

export type AgendaEvent = {
  id: string; // unique pour chaque occurrence
  title: string;
  date: string; // YYYY-MM-DD
  status: "todo" | "done" | "late";
  category: string;
  path: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS = 400;
const pad = (n: number) => String(n).padStart(2, "0");
export const localISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Valide ?from=&to= : dates réelles, ordre correct, plage limitée. Renvoie null si invalide. */
export function parseRange(from: string | null, to: string | null): { from: Date; to: Date } | null {
  if (!from || !to || !ISO.test(from) || !ISO.test(to)) return null;
  const a = parse(from);
  const b = parse(to);
  if (localISO(a) !== from || localISO(b) !== to || b < a) return null;
  return (b.getTime() - a.getTime()) / 86_400_000 > MAX_DAYS ? null : { from: a, to: b };
}

export type DoneLog = { id: string; doneAt: Date; task: Pick<Task, "name" | "category" | "subCategory"> };

/**
 * Tâches à venir (dueDates gère tous les types : tous les X jours, jours de la semaine, ponctuelle)
 * puis tâches faites dans la plage. Une tâche en retard est ramenée à aujourd'hui et marquée « en retard ».
 */
export function agendaEvents(tasks: Task[], logs: DoneLog[], from: Date, to: Date, now = new Date()): AgendaEvent[] {
  const out: AgendaEvent[] = [];
  const today = localISO(now);
  for (const t of tasks) {
    const late = daysUntilDue(t, now) < 0;
    for (const d of dueDates(t, from, to, now)) {
      const date = localISO(d);
      out.push({
        id: `due-${t.id}-${date}`,
        title: t.name,
        date,
        status: late && date === today ? "late" : "todo",
        category: t.category,
        path: "/",
      });
    }
  }
  for (const l of logs) {
    out.push({ id: `log-${l.id}`, title: l.task.name, date: localISO(l.doneAt), status: "done", category: l.task.category, path: "/" });
  }
  return out;
}
