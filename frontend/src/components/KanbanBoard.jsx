import TaskCard from "./TaskCard.jsx";

const COLUMNS = ["To Do", "In Progress", "Done"];

const KanbanBoard = ({
  tasks,
  employees,
  isAdmin,
  onStatusDrop,
  onEdit,
  onDelete,
}) => {
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStatusDrop(id, status);
  };

  const nameFor = (id) => employees.find((u) => u.id === id)?.name || "Unassigned";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((status) => (
        <section
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, status)}
          className="min-h-[220px] rounded-2xl border border-dashed border-slate-200 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {status} ({tasks.filter((t) => t.status === status).length})
          </h2>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  assigneeName={nameFor(task.assignedTo)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={onDragStart}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default KanbanBoard;
