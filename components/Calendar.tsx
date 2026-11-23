"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { useLogs } from "@/hooks/useLogs";
import {
  Task,
  addDays,
  capitalize,
  dayKey,
  daysUntilDue,
  dueDates,
  dueLabel,
  sameDay,
  startOfDayDate,
  taskWhere,
} from "@/lib/tasks";

interface Props {
  tasks: Task[];
  onDone: (id: string) => void;
}

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function Calendar({ tasks, onDone }: Props) {
  const today = startOfDayDate(new Date());
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  // Grille du mois, du lundi au dimanche
  const offset = (cursor.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const rows = Math.ceil((offset + daysInMonth) / 7);
  const gridStart = addDays(cursor, -offset);
  const cells = Array.from({ length: rows * 7 }, (_, i) => addDays(gridStart, i));
  const gridEnd = cells[cells.length - 1];

  const logs = useLogs(gridStart, addDays(gridEnd, 1), tasks);

  const doneByDay = useMemo(() => {
    const map = new Map<string, typeof logs>();
    for (const log of logs) {
      const k = dayKey(new Date(log.doneAt));
      const arr = map.get(k) ?? [];
      arr.push(log);
      map.set(k, arr);
    }
    return map;
  }, [logs]);

  const startMs = gridStart.getTime();
  const endMs = gridEnd.getTime();
  const plannedByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      for (const d of dueDates(t, new Date(startMs), new Date(endMs))) {
        const k = dayKey(d);
        const arr = map.get(k) ?? [];
        arr.push(t);
        map.set(k, arr);
      }
    }
    return map;
  }, [tasks, startMs, endMs]);

  const goMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(next);
    const isCurrent = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelected(isCurrent ? today : next);
  };

  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  const pickDay = (d: Date) => {
    setSelected(d);
    if (d.getMonth() !== cursor.getMonth()) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const selKey = dayKey(selected);
  const selDone = doneByDay.get(selKey) ?? [];
  const selPlanned = plannedByDay.get(selKey) ?? [];
  const selIsToday = sameDay(selected, today);

  return (
    <div>
      <div className="cal__head">
        <h2 className="cal__title">
          {capitalize(cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }))}
        </h2>
        <div className="cal__nav">
          <button className="btn btn--outline" onClick={() => goMonth(-1)} aria-label="Mois précédent">‹</button>
          <button className="btn btn--outline" onClick={goToday}>Aujourd'hui</button>
          <button className="btn btn--outline" onClick={() => goMonth(1)} aria-label="Mois suivant">›</button>
        </div>
      </div>

      <div className="cal__grid">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="cal__dow" aria-hidden>{w}</div>
        ))}
        {cells.map((d) => {
          const k = dayKey(d);
          const done = doneByDay.get(k)?.length ?? 0;
          const planned = plannedByDay.get(k)?.length ?? 0;
          const label =
            d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) +
            (done ? `, ${done} fait` : "") +
            (planned ? `, ${planned} prévue${planned > 1 ? "s" : ""}` : "");
          const cls = [
            "cal__day",
            d.getMonth() !== cursor.getMonth() ? "is-out" : "",
            sameDay(d, today) ? "is-today" : "",
            sameDay(d, selected) ? "is-selected" : "",
          ].filter(Boolean).join(" ");
          return (
            <button key={k} type="button" className={cls} onClick={() => pickDay(d)} aria-label={label} aria-pressed={sameDay(d, selected)}>
              <span className="cal__num">{d.getDate()}</span>
              {done > 0 && <span className="cal__done" aria-hidden>✓{done}</span>}
              {planned > 0 && <span className="cal__todo" aria-hidden>○{planned}</span>}
            </button>
          );
        })}
      </div>

      <p className="cal__legend">
        <span className="cal__done">✓ fait</span> · <span className="cal__todo">○ prévues</span>
      </p>

      <div className="cal__detail">
        <h3>{capitalize(selected.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }))}</h3>

        {selDone.length === 0 && selPlanned.length === 0 && <p className="empty">Rien ce jour-là.</p>}

        {selDone.length > 0 && (
          <>
            <h4>Fait</h4>
            <ul className="cal__items">
              {selDone.map((log) => (
                <li key={log.id} className="cal__item">
                  <span className="cal__item-icon"><Icon name={log.task.icon} size={26} /></span>
                  <span className="cal__item-text">
                    {log.task.name}
                    <small>
                      {taskWhere(log.task)} ·{" "}
                      {new Date(log.doneAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {selPlanned.length > 0 && (
          <>
            <h4>{selIsToday ? "À faire" : "Prévues"}</h4>
            <ul className="cal__items">
              {selPlanned.map((t) => (
                <li key={t.id} className="cal__item">
                  <span className="cal__item-icon"><Icon name={t.icon} size={26} /></span>
                  <span className="cal__item-text">
                    {t.name}
                    <small>
                      {taskWhere(t)}
                      {selIsToday && daysUntilDue(t) < 0 ? ` · ${dueLabel(t)}` : ""}
                    </small>
                  </span>
                  {selIsToday && (
                    <button className="btn btn--primary" onClick={() => onDone(t.id)}>Fait</button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
