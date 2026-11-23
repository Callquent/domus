import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { agendaEvents, parseRange } from "@/lib/agenda-feed";
import type { Task } from "@/lib/tasks";

export const dynamic = "force-dynamic";

// Flux de dates pour l'application « Agenda » : GET /api/agenda?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = parseRange(url.searchParams.get("from"), url.searchParams.get("to"));
  if (!range) return NextResponse.json({ error: "Paramètres from et to (YYYY-MM-DD, 400 jours maximum) requis." }, { status: 400 });

  const end = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate() + 1);
  const [rows, logs] = await Promise.all([
    prisma.task.findMany(),
    prisma.taskLog.findMany({ where: { doneAt: { gte: range.from, lt: end } }, include: { task: true } }),
  ]);
  const tasks: Task[] = rows.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    subCategory: t.subCategory,
    icon: t.icon,
    everyDays: t.everyDays,
    lastDoneAt: t.lastDoneAt ? t.lastDoneAt.toISOString() : null,
    startDate: t.startDate ? t.startDate.toISOString() : null,
    weekDays: t.weekDays,
    createdAt: t.createdAt.toISOString(),
  }));
  return NextResponse.json({ events: agendaEvents(tasks, logs, range.from, range.to) });
}
