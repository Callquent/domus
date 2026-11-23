"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import DoneList from "@/components/DoneList";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { useLogs } from "@/hooks/useLogs";
import { useTasks } from "@/hooks/useTasks";
import {
  Task,
  addDays,
  daysUntilDue,
  isDoneToday,
  isFinished,
  sameDay,
  startOfDayDate,
} from "@/lib/tasks";

type Tab = "todo" | "done" | "calendar";

export default function Home() {
  const { tasks, loaded, markDone, reopenTask, addTask, updateTask, removeTask } = useTasks();
  const [tab, setTab] = useState<Tab>("todo");
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Rafraîchit l'affichage chaque minute : une tâche répétitive réapparaît dans « À faire » dès que son échéance arrive
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Historique des 7 derniers jours (onglet « Fait » et son compteur)
  const today = startOfDayDate(new Date());
  const logs = useLogs(addDays(today, -6), addDays(today, 1), tasks);
  const doneToday = logs.filter((l) => sameDay(new Date(l.doneAt), today)).length;

  // Une tâche terminée (non répétitive, faite) ou faite aujourd'hui n'est plus « à faire » : elle est dans « Fait »
  const open = tasks.filter((t) => !isFinished(t) && !isDoneToday(t));
  const categories = Array.from(new Set(open.map((t) => t.category)));
  const activeFilter = categories.includes(filter) ? filter : "";
  const visible = activeFilter ? open.filter((t) => t.category === activeFilter) : open;

  const due = visible.filter((t) => daysUntilDue(t) <= 0);
  const upcoming = visible.filter((t) => daysUntilDue(t) > 0);
  const todoCount = open.filter((t) => daysUntilDue(t) <= 0).length;

  // Le formulaire est replié quand la liste n'est pas vide
  const showForm = formOpen || (loaded && tasks.length === 0);

  // Une carte, ou le formulaire de modification à sa place
  const card = (t: Task, emphasis: boolean) =>
    editingId === t.id ? (
      <li key={t.id} className="task-edit">
        <TaskForm
          initial={t}
          onSubmit={async (input) => {
            const err = await updateTask(t.id, input);
            if (!err) setEditingId(null);
            return err;
          }}
          onCancel={() => setEditingId(null)}
        />
      </li>
    ) : (
      <TaskCard
        key={t.id}
        task={t}
        onDone={markDone}
        onEdit={setEditingId}
        onRemove={removeTask}
        emphasis={emphasis}
      />
    );

  const tabs: { key: Tab; label: string }[] = [
    { key: "todo", label: loaded ? `À faire (${todoCount})` : "À faire" },
    { key: "done", label: loaded ? `Fait (${doneToday})` : "Fait" },
    { key: "calendar", label: "Calendrier" },
  ];

  return (
    <main className="page">
      <header className="head">
        <img src="/logo.svg" alt="" width={48} height={48} />
        <h1>Ménage</h1>
      </header>

      {tasks.length > 0 && (
        <button
          type="button"
          className="btn btn--outline add-toggle"
          onClick={() => setFormOpen((v) => !v)}
          aria-expanded={showForm}
        >
          {showForm ? "Fermer le formulaire" : "+ Ajouter une tâche"}
        </button>
      )}

      {showForm && <TaskForm onSubmit={addTask} />}

      <div className="tabs" role="tablist" aria-label="Affichage">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`tab${tab === key ? " is-active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "todo" && (
        <section role="tabpanel" aria-label="À faire">
          {!loaded && <p className="empty">Chargement…</p>}

          {loaded && categories.length > 1 && (
            <div className="chips" role="group" aria-label="Filtrer par catégorie">
              <button
                type="button"
                className={`chip${activeFilter === "" ? " is-active" : ""}`}
                aria-pressed={activeFilter === ""}
                onClick={() => setFilter("")}
              >
                Toutes
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip${activeFilter === c ? " is-active" : ""}`}
                  aria-pressed={activeFilter === c}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loaded && tasks.length === 0 && (
            <p className="empty">Aucune tâche pour le moment : ajoutez-en une avec le formulaire.</p>
          )}

          {loaded && tasks.length > 0 && due.length === 0 && (
            <p className="empty">Rien à faire pour aujourd'hui.</p>
          )}

          {due.length > 0 && (
            <ul className="list">
              {due.map((t) => card(t, true))}
            </ul>
          )}

          {upcoming.length > 0 && (
            <>
              <h2 className="section-title">À venir</h2>
              <ul className="list">
                {upcoming.map((t) => card(t, false))}
              </ul>
            </>
          )}
        </section>
      )}

      {tab === "done" && (
        <section role="tabpanel" aria-label="Fait">
          <DoneList tasks={tasks} logs={logs} onReopen={reopenTask} />
        </section>
      )}

      {tab === "calendar" && (
        <section role="tabpanel" aria-label="Calendrier">
          <Calendar tasks={tasks} onDone={markDone} />
        </section>
      )}
    </main>
  );
}
