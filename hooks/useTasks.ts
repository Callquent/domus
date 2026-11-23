"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Task, TaskInput, daysUntilDue } from "@/lib/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      if (res.ok) setTasks(await res.json());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Au retour sur l'onglet (nouveau jour, autre appareil…), on recharge les tâches
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  const markDone = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}/done`, { method: "POST" });
    refresh();
  }, [refresh]);

  const reopenTask = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}/done`, { method: "DELETE" });
    refresh();
  }, [refresh]);

  /** Crée (POST) ou modifie (PATCH) une tâche. Retourne un message d'erreur, ou null si tout s'est bien passé. */
  const save = useCallback(async (url: string, method: "POST" | "PATCH", input: TaskInput): Promise<string | null> => {
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        return body?.error ?? "Impossible d'enregistrer la tâche.";
      }
      await refresh();
      return null;
    } catch {
      return "Impossible de joindre le serveur.";
    }
  }, [refresh]);

  const addTask = useCallback((input: TaskInput) => save("/api/tasks", "POST", input), [save]);
  const updateTask = useCallback((id: string, input: TaskInput) => save(`/api/tasks/${id}`, "PATCH", input), [save]);

  const removeTask = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    refresh();
  }, [refresh]);

  // Mémorisé : l'identité du tableau ne change que lorsque les tâches changent
  const sorted = useMemo(
    () => [...tasks].sort((a, b) => daysUntilDue(a) - daysUntilDue(b)),
    [tasks]
  );

  return { tasks: sorted, loaded, markDone, reopenTask, addTask, updateTask, removeTask };
}
