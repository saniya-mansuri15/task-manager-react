import { Router } from "express";
import { auth, requireAdmin } from "../middleware/auth.js";
import { readDb } from "../utils/store.js";

const router = Router();

// Admins need the employee list when assigning tasks
router.get("/", auth, requireAdmin, (req, res) => {
  const db = readDb();
  const employees = db.users
    .filter((u) => u.role === "employee")
    .map((u) => ({ id: u.id, name: u.name, email: u.email }));
  res.json(employees);
});

export default router;
