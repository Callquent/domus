"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SUBCATEGORIES, SubCategory } from "@/lib/tasks";

export function useSubCategories() {
  const [custom, setCustom] = useState<SubCategory[]>([]);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/subcategories", { cache: "no-store" });
    if (!res.ok) return;
    const rows: SubCategory[] = await res.json();
    setCustom(rows.map((r) => ({ ...r, custom: true })));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Retourne l'id de la sous-catégorie créée (ou null en cas d'échec). */
  const add = useCallback(
    async (name: string, category: string, icon: string) => {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, icon }),
      });
      if (!res.ok) return null;
      const created: SubCategory = await res.json();
      await refresh();
      return created.id;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
      refresh();
    },
    [refresh]
  );

  return { subCategories: [...DEFAULT_SUBCATEGORIES, ...custom], add, remove };
}
