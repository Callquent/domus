import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/tasks";

export async function GET() {
  const rows = await prisma.subCategory.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name, category, icon } = await req.json();
  if (typeof name !== "string" || !name.trim() || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const row = await prisma.subCategory.create({
    data: { name: name.trim(), category, icon: typeof icon === "string" && icon ? icon : "etoile" },
  });
  return NextResponse.json(row, { status: 201 });
}
