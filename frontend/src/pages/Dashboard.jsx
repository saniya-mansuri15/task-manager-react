import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskForm from "../components/TaskForm.jsx";

const matchesDueFilter = (task, dueFilter) => {
  if (dueFilter === "all") return true;
  if (!task.dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  if (dueFilter === "overdue") return due < today && task.status !== "Done";
  if (dueFilter === "today") return due.getTime() === today.getTime();
  if (dueFilter === "upcoming") return due > today;
  return true;
};

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/tasks");
      setTasks(data);
      if (isAdmin) {
        setEmployees(await api("/api/users"));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin]);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      progress: tasks.filter((t) => t.status === "In Progress").length,
      done: tasks.filter((t) => t.status === "Done").length,
    }),
    [tasks]
  );

  const visible = tasks.filter((t) => {
    const q = query.trim().toLowerCase();
    const titleOk = !q || t.title.toLowerCase().includes(q);
    const statusOk = statusFilter === "all" || t.status === statusFilter;
    const dueOk = matchesDueFilter(t, dueFilter);
    return titleOk && statusOk && dueOk;
  });

  const updateStatus = async (id, status) => {
    const previous = tasks;
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await api(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((list) => list.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api(`/api/tasks/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(editing),
      });
      setTasks((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Manage all tasks" : "Your assigned tasks"}
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/create-task"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            New task
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total", counts.total],
          ["To Do", counts.todo],
          ["In Progress", counts.progress],
          ["Done", counts.done],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All statuses</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          value={dueFilter}
          onChange={(e) => setDueFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All due dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <KanbanBoard
          tasks={visible}
          employees={employees}
          isAdmin={isAdmin}
          onStatusDrop={updateStatus}
          onEdit={setEditing}
          onDelete={deleteTask}
        />
      )}

      {editing && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit task</h2>
              <button type="button" onClick={() => setEditing(null)}>
                Close
              </button>
            </div>
            <TaskForm
              values={editing}
              onChange={setEditing}
              onSubmit={saveEdit}
              employees={employees}
              submitLabel="Save changes"
              loading={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
