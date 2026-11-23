"use client";

import { useEffect, useState } from "react";

export interface TaskLogEntry {
  id: string;
  taskId: string;
  doneAt: string; // ISO
  task: { name: string; icon: string; category: string; subCategory: string };
}

/** Historique des tâches faites entre `from` (inclus) et `to` (exclu). `version` relance la requête quand il change. */
export function useLogs(from: Date, to: Date, version: unknown) {
  const [logs, setLogs] = useState<TaskLogEntry[]>([]);
  const fromMs = from.getTime();
  const toMs = to.getTime();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const qs = `from=${new Date(fromMs).toISOString()}&to=${new Date(toMs).toISOString()}`;
        const res = await fetch(`/api/logs?${qs}`, { cache: "no-store" });
        if (res.ok && !cancelled) setLogs(await res.json());
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [fromMs, toMs, version]);

  return logs;
}
