"use client";

import { useState } from "react";
import Icon, { ICON_NAMES } from "@/components/Icon";
import { useSubCategories } from "@/hooks/useSubCategories";
import { suggestIcon } from "@/lib/icon-keywords";
import {
  CATEGORIES,
  Task,
  TaskInput,
  WEEKDAY_LONG,
  WEEKDAY_ORDER,
  WEEKDAY_SHORT,
  fromDateInput,
  isRepeating,
  isWeekly,
  sameDay,
  toDateInput,
  weekDaysOf,
} from "@/lib/tasks";

interface Props {
  /** Mode modification : la tâche à modifier */
  initial?: Task;
  onSubmit: (input: TaskInput) => Promise<string | null>;
  onCancel?: () => void;
}

export default function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const editing = !!initial;
  const { subCategories, add, remove } = useSubCategories();

  const [category, setCategory] = useState(initial?.category ?? "");
  const [subId, setSubId] = useState<string | null>(null); // null = pas touché (modification : sous-catégorie actuelle)
  const [taskName, setTaskName] = useState(initial?.name ?? "");
  const [repeat, setRepeat] = useState(initial ? isRepeating(initial) : false); // non répétitive par défaut
  const [mode, setMode] = useState<"interval" | "weekdays">(initial && isWeekly(initial) ? "weekdays" : "interval");
  const [everyDays, setEveryDays] = useState(initial?.everyDays || 7);
  const [days, setDays] = useState<number[]>(initial ? weekDaysOf(initial) : []);
  const [startStr, setStartStr] = useState(() =>
    toDateInput(initial?.startDate ? new Date(initial.startDate) : new Date())
  );
  const [error, setError] = useState("");

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("etoile");
  const [iconTouched, setIconTouched] = useState(false);

  const visible = subCategories.filter((s) => s.category === category);

  const initialSub = initial
    ? subCategories.find(
        (s) =>
          s.category === initial.category &&
          (s.name === initial.subCategory || (!initial.subCategory && s.name === initial.name))
      )
    : undefined;
  const selected = subId === null ? initialSub : subCategories.find((s) => s.id === subId);

  // Ce qui sera enregistré comme catégorie / sous-catégorie / pictogramme
  const target = selected
    ? { category: selected.category, subCategory: selected.name, icon: selected.icon }
    : initial && category === initial.category
    ? { category: initial.category, subCategory: initial.subCategory, icon: initial.icon }
    : null;

  const pickCategory = (c: string) => {
    setCategory(c);
    setSubId("");
    if (!editing) setTaskName("");
    setAdding(false);
  };

  // Tant que l'utilisateur n'a pas choisi lui-même un pictogramme, on le propose d'après le nom saisi
  const onNameChange = (value: string) => {
    setNewName(value);
    if (!iconTouched) setNewIcon(suggestIcon(value) ?? "etoile");
  };

  const pickIcon = (n: string) => {
    setNewIcon(n);
    setIconTouched(true);
  };

  const createSub = async () => {
    if (!newName.trim()) return;
    const id = await add(newName.trim(), category, newIcon);
    if (id) {
      setSubId(id);
      setNewName("");
      setNewIcon("etoile");
      setIconTouched(false);
      setAdding(false);
    }
  };

  const removeSub = (id: string) => {
    if (id === selected?.id) setSubId("");
    remove(id);
  };

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    const weekly = repeat && mode === "weekdays";
    if (weekly && days.length === 0) {
      setError("Choisissez au moins un jour de la semaine.");
      return;
    }

    // Début aujourd'hui (ou champ vidé) = tout de suite ; sinon minuit local du jour choisi
    const start = startStr ? fromDateInput(startStr) : null;
    const startDate = start && !sameDay(start, new Date()) ? start.toISOString() : null;

    const err = await onSubmit({
      name: taskName.trim() || target.subCategory || initial?.name || "",
      category: target.category,
      subCategory: target.subCategory,
      icon: target.icon,
      everyDays: repeat && mode === "interval" ? Math.max(1, everyDays || 1) : null,
      weekDays: weekly ? [...days].sort((a, b) => a - b).join(",") : "",
      startDate,
    });
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (!editing) {
      setSubId("");
      setTaskName("");
      setRepeat(false);
      setDays([]);
      setStartStr(toDateInput(new Date()));
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2 className="form__title">{editing ? "Modifier la tâche" : "Ajouter une tâche"}</h2>

      <fieldset className="field">
        <legend>Catégorie</legend>
        <div className="cats" role="radiogroup" aria-label="Catégorie">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={category === c}
              className={`cat${category === c ? " is-selected" : ""}`}
              onClick={() => pickCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Sous-catégorie</legend>
        {!category ? (
          <p className="hint">Choisissez d'abord une catégorie.</p>
        ) : (
          <>
            <div className="cats" role="radiogroup" aria-label="Sous-catégorie">
              {visible.map((s) => (
                <div key={s.id} className="cat-wrap">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected?.id === s.id}
                    className={`cat${selected?.id === s.id ? " is-selected" : ""}`}
                    onClick={() => setSubId(s.id)}
                  >
                    <Icon name={s.icon} size={30} />
                    {s.name}
                  </button>
                  {s.custom && (
                    <button
                      type="button"
                      className="cat__del"
                      onClick={() => removeSub(s.id)}
                      aria-label={`Supprimer ${s.name}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="cat-wrap">
                <button
                  type="button"
                  className="cat cat--add"
                  onClick={() => setAdding((v) => !v)}
                  aria-expanded={adding}
                >
                  <span className="cat__plus" aria-hidden>+</span>
                  Ajouter
                </button>
              </div>
            </div>

            {visible.length === 0 && !adding && (
              <p className="hint">Aucune sous-catégorie ici : ajoutez la vôtre avec « + Ajouter ».</p>
            )}

            {adding && (
              <div className="sub-new">
                <div className="sub-new__row">
                  <span className="sub-new__preview" aria-hidden>
                    <Icon name={newIcon} size={32} />
                  </span>
                  <input
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        createSub();
                      }
                    }}
                    placeholder={`Ex. lunettes, garage, éclairage (${category})`}
                    aria-label="Nom de la sous-catégorie"
                  />
                </div>
                <p className="hint">
                  Le pictogramme est proposé d'après le nom. Cliquez sur un autre pour le changer.
                </p>
                <div className="icons" role="radiogroup" aria-label="Pictogramme">
                  {ICON_NAMES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={newIcon === n}
                      aria-label={n}
                      className={`icons__item${newIcon === n ? " is-selected" : ""}`}
                      onClick={() => pickIcon(n)}
                    >
                      <Icon name={n} size={26} />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={createSub}
                  disabled={!newName.trim()}
                >
                  Créer la sous-catégorie
                </button>
              </div>
            )}
          </>
        )}
      </fieldset>

      {(selected || editing) && (
        <label className="field">
          <span>Tâche</span>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Décrivez la tâche (facultatif)"
            maxLength={120}
          />
          {!editing && selected && (
            <small className="hint">
              Sans description, la tâche s'appellera « {selected.name} ».
            </small>
          )}
        </label>
      )}

      <label className="field field--inline">
        <span>Commence le</span>
        <input
          type="date"
          className="date-input"
          value={startStr}
          min={editing ? undefined : toDateInput(new Date())}
          onChange={(e) => setStartStr(e.target.value)}
        />
      </label>

      <label className="switch">
        <input
          type="checkbox"
          role="switch"
          checked={repeat}
          onChange={(e) => setRepeat(e.target.checked)}
        />
        <span className="switch__track" aria-hidden />
        <span>Tâche répétitive</span>
      </label>

      {repeat && (
        <>
          <div className="chips" role="radiogroup" aria-label="Type de répétition">
            <button
              type="button"
              role="radio"
              aria-checked={mode === "interval"}
              className={`chip${mode === "interval" ? " is-active" : ""}`}
              onClick={() => setMode("interval")}
            >
              Tous les X jours
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "weekdays"}
              className={`chip${mode === "weekdays" ? " is-active" : ""}`}
              onClick={() => setMode("weekdays")}
            >
              Jours de la semaine
            </button>
          </div>

          {mode === "interval" ? (
            <label className="field field--inline">
              <span>À refaire tous les</span>
              <input
                type="number"
                min={1}
                value={everyDays}
                onChange={(e) => setEveryDays(Number(e.target.value))}
              />
              <span>jours</span>
            </label>
          ) : (
            <div className="field">
              <span>Chaque semaine le</span>
              <div className="chips" role="group" aria-label="Jours de la semaine">
                {WEEKDAY_ORDER.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip${days.includes(d) ? " is-active" : ""}`}
                    aria-pressed={days.includes(d)}
                    aria-label={WEEKDAY_LONG[d]}
                    onClick={() => toggleDay(d)}
                  >
                    {WEEKDAY_SHORT[d]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {error && <p className="form__error" role="alert">{error}</p>}

      <div className="form__actions">
        <button className="btn btn--primary" type="submit" disabled={!target}>
          {editing ? "Enregistrer" : "Ajouter à la liste"}
        </button>
        {onCancel && (
          <button className="btn btn--ghost" type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
