import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") ?? "");
  const to = new Date(searchParams.get("to") ?? "");
  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json({ error: "Paramètres from/to invalides" }, { status: 400 });
  }
  const logs = await prisma.taskLog.findMany({
    where: { doneAt: { gte: from, lt: to } },
    include: { task: { select: { name: true, icon: true, category: true, subCategory: true } } },
    orderBy: { doneAt: "desc" },
  });
  return NextResponse.json(logs);
}
