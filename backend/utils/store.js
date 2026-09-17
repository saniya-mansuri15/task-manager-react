import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "db.json");

const emptyDb = () => ({ users: [], tasks: [] });

const ensureDb = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(emptyDb(), null, 2));
  }
};

export const readDb = () => {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
};

export const writeDb = (db) => {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};
