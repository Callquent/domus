import Icon from "@/components/Icon";
import { Task, daysUntilDue, dueLabel, isWeekly, lastDoneLabel, repeatLabel, taskWhere } from "@/lib/tasks";

interface Props {
  task: Task;
  onDone: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  /** Bouton principal (tâches à faire) ou discret (tâches à venir) */
  emphasis?: boolean;
}

export default function TaskCard({ task, onDone, onEdit, onRemove, emphasis = true }: Props) {
  const d = daysUntilDue(task);
  const status = d < 0 ? "late" : d === 0 ? "today" : "ok";
  // Un jour fixe de la semaine ne se « fait » pas à l'avance
  const canDone = emphasis || !isWeekly(task);

  return (
    <li className={`task task--${status}`}>
      <span className="task__icon"><Icon name={task.icon} size={34} /></span>
      <div className="task__body">
        <p className="task__sub">{taskWhere(task)}</p>
        <h2 className="task__name">{task.name}</h2>
        <p className="task__due">{dueLabel(task)}</p>
        <p className="task__meta">
          {lastDoneLabel(task)} · {repeatLabel(task)}
        </p>
      </div>
      <div className="task__actions">
        {canDone && (
          <button
            className={`btn ${emphasis ? "btn--primary" : "btn--outline"}`}
            onClick={() => onDone(task.id)}
          >
            Marquer comme fait
          </button>
        )}
        <button className="btn btn--outline" onClick={() => onEdit(task.id)} aria-label={`Modifier ${task.name}`}>
          Modifier
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => {
            if (window.confirm(`Supprimer « ${task.name} » ?`)) onRemove(task.id);
          }}
          aria-label={`Supprimer ${task.name}`}
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}
