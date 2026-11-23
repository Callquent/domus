import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/task-input";

type Ctx = { params: Promise<{ id: string }> };

// Modifier une tâche (la date du dernier « fait » est conservée)
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const parsed = parseTaskInput(await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const task = await prisma.task.update({ where: { id }, data: parsed.data });
    return NextResponse.json(task);
  } catch (e) {
    console.error("PATCH /api/tasks/[id]", e);
    return NextResponse.json({ error: "Impossible de modifier la tâche (introuvable ou base de données)." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } }).catch(() => null);
  return new NextResponse(null, { status: 204 });
}
