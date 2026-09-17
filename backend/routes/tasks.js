import { Router } from "express";
import { auth, requireAdmin } from "../middleware/auth.js";
import { readDb, writeDb } from "../utils/store.js";

const router = Router();
const STATUSES = ["To Do", "In Progress", "Done"];

const canSeeTask = (user, task) =>
  user.role === "admin" || task.assignedTo === user.id;

router.get("/", auth, (req, res) => {
  const db = readDb();
  const tasks =
    req.user.role === "admin"
      ? db.tasks
      : db.tasks.filter((t) => t.assignedTo === req.user.id);
  res.json(tasks);
});

router.post("/", auth, requireAdmin, (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const db = readDb();
  const task = {
    id: Date.now().toString(),
    title,
    description: description || "",
    assignedTo: assignedTo || "",
    status: STATUSES.includes(status) ? status : "To Do",
    dueDate: dueDate || "",
    createdAt: new Date().toISOString(),
  };

  db.tasks.push(task);
  writeDb(db);
  res.status(201).json(task);
});

router.put("/:id", auth, (req, res) => {
  const db = readDb();
  const task = db.tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (!canSeeTask(req.user, task)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Employees may only change status of their own tasks
  if (req.user.role === "employee") {
    if (req.body.status && STATUSES.includes(req.body.status)) {
      task.status = req.body.status;
    }
  } else {
    const { title, description, assignedTo, status, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status && STATUSES.includes(status)) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
  }

  writeDb(db);
  res.json(task);
});

router.delete("/:id", auth, requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  db.tasks.splice(index, 1);
  writeDb(db);
  res.json({ message: "Task deleted" });
});

export default router;
