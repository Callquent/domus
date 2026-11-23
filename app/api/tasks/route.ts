import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/task-input";

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const parsed = parseTaskInput(await req.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const task = await prisma.task.create({ data: parsed.data });
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    console.error("POST /api/tasks", e);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la tâche (base de données). Voir le terminal pour le détail." },
      { status: 500 }
    );
  }
}
