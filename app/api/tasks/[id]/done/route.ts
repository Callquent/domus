import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// Marquer comme fait : met à jour la tâche et ajoute une ligne à l'historique
export async function POST(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const now = new Date();
  try {
    const [task] = await prisma.$transaction([
      prisma.task.update({ where: { id }, data: { lastDoneAt: now } }),
      prisma.taskLog.create({ data: { taskId: id, doneAt: now } }),
    ]);
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }
}

// Remettre à faire : supprime le dernier « fait » de l'historique et rouvre la tâche
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const last = await prisma.taskLog.findFirst({ where: { taskId: id }, orderBy: { doneAt: "desc" } });
  if (last) await prisma.taskLog.delete({ where: { id: last.id } });
  await prisma.task.update({ where: { id }, data: { lastDoneAt: null } }).catch(() => null);
  return new NextResponse(null, { status: 204 });
}
