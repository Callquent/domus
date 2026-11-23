"use client";

import Icon from "@/components/Icon";
import { TaskLogEntry } from "@/hooks/useLogs";
import { Task, capitalize, dayKey, startOfDayDate, taskWhere } from "@/lib/tasks";

interface Props {
  tasks: Task[];
  logs: TaskLogEntry[];
  onReopen: (taskId: string) => void;
}

function dayTitle(date: Date, today: Date) {
  const diff = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return capitalize(date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
}

export default function DoneList({ tasks, logs, onReopen }: Props) {
  const today = startOfDayDate(new Date());

  // Regroupement par jour (les logs arrivent du plus récent au plus ancien)
  const groups: { key: string; date: Date; items: TaskLogEntry[] }[] = [];
  for (const log of logs) {
    const date = startOfDayDate(new Date(log.doneAt));
    const key = dayKey(date);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, date, items: [] };
      groups.push(group);
    }
    group.items.push(log);
  }

  if (groups.length === 0) {
    return <p className="empty">Aucune tâche faite ces 7 derniers jours.</p>;
  }

  const todayCount = groups.find((g) => g.date.getTime() === today.getTime())?.items.length ?? 0;
  const seen = new Set<string>(); // « Remettre à faire » n'est proposé que sur le dernier « fait » de chaque tâche

  return (
    <div>
      <p className="list-sub">
        Aujourd'hui : {todayCount} · 7 derniers jours : {logs.length}
      </p>
      {groups.map((g) => (
        <section key={g.key} className="group">
          <h2 className="group__title">
            {dayTitle(g.date, today)} ({g.items.length})
          </h2>
          <ul className="cal__items card">
            {g.items.map((log) => {
              const task = tasks.find((t) => t.id === log.taskId);
              const canReopen = !seen.has(log.taskId) && !!task && task.lastDoneAt !== null;
              seen.add(log.taskId);
              return (
                <li key={log.id} className="cal__item">
                  <span className="cal__item-icon"><Icon name={log.task.icon} size={28} /></span>
                  <span className="cal__item-text">
                    {log.task.name}
                    <small>
                      {taskWhere(log.task)} ·{" "}
                      {new Date(log.doneAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </small>
                  </span>
                  {canReopen && (
                    <button className="btn btn--outline" onClick={() => onReopen(log.taskId)}>
                      Remettre à faire
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
