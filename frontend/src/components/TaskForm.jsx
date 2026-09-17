const TaskForm = ({
  values,
  onChange,
  onSubmit,
  employees,
  submitLabel,
  loading,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <label className="block text-sm font-medium">
      Title
      <input
        required
        value={values.title}
        onChange={(e) => onChange({ ...values, title: e.target.value })}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
    <label className="block text-sm font-medium">
      Description
      <textarea
        rows={3}
        value={values.description}
        onChange={(e) => onChange({ ...values, description: e.target.value })}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="block text-sm font-medium">
        Assign to
        <select
          value={values.assignedTo}
          onChange={(e) => onChange({ ...values, assignedTo: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">Unassigned</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Status
        <select
          value={values.status}
          onChange={(e) => onChange({ ...values, status: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Due date
        <input
          type="date"
          value={values.dueDate}
          onChange={(e) => onChange({ ...values, dueDate: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
    </div>
    <button
      type="submit"
      disabled={loading}
      className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-60"
    >
      {loading ? "Saving..." : submitLabel}
    </button>
  </form>
);

export default TaskForm;
