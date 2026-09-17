const TaskCard = ({ task, assigneeName, isAdmin, onEdit, onDelete, onDragStart }) => {
  const overdue =
    task.dueDate && task.status !== "Done" && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{task.title}</h3>
        {overdue && (
          <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
            Overdue
          </span>
        )}
      </div>
      {task.description && (
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {task.dueDate && <span>Due {task.dueDate}</span>}
        {isAdmin && assigneeName && <span>· {assigneeName}</span>}
      </div>
      {isAdmin && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs dark:border-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 dark:border-rose-900"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
