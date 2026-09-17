import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import TaskForm from "../components/TaskForm.jsx";

const empty = {
  title: "",
  description: "",
  assignedTo: "",
  status: "To Do",
  dueDate: "",
};

const CreateTask = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/users")
      .then(setEmployees)
      .catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify(values),
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-6 text-2xl font-semibold">Create task</h1>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      <TaskForm
        values={values}
        onChange={setValues}
        onSubmit={onSubmit}
        employees={employees}
        submitLabel="Create task"
        loading={loading}
      />
    </div>
  );
};

export default CreateTask;
