# Task Manager

Full-stack task management SPA for a **FirstHire Associate Frontend Developer** interview: React (hooks), client-side routing, Fetch API, LocalStorage, and HTML5 drag-and-drop. Backend is Node.js + Express with JWT auth. Data is stored in a local JSON file so you do not need MongoDB.

Roles:

- **Admin** — create, edit, delete, and assign tasks
- **Employee** — see only assigned tasks and update status (To Do / In Progress / Done)

## Run locally

You need Node.js 18+.

**Terminal 1 — API**

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API: `http://localhost:5000`

**Terminal 2 — React app**

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173`

Vite proxies `/api` to the Express server.

1. Open Signup and create an **Admin** account.
2. Create an **Employee** account (or use another browser / incognito).
3. Log in as Admin, create a task, assign it, then log in as Employee to update status (or drag cards on the board).

## Frontend Architecture

The frontend is a **single-page application (SPA)**. `react-router-dom` swaps pages in the browser without a full reload.

```
frontend/src
  api/client.js          Fetch wrapper + JWT from LocalStorage
  context/
    AuthContext.jsx      login / signup / logout (React Context + hooks)
    ThemeContext.jsx     dark mode persisted with LocalStorage API
  components/
    Navbar.jsx           nav + theme toggle
    ProtectedRoute.jsx   route guards (auth + admin-only)
    KanbanBoard.jsx      drag-and-drop columns
    TaskCard.jsx         task UI
    TaskForm.jsx         shared create/edit form
  pages/
    Login.jsx
    Signup.jsx
    Dashboard.jsx        counts, search, filters, board
    CreateTask.jsx       admin-only
  App.jsx                route table
  main.jsx               providers (Router, Theme, Auth)
```

### How data flows

1. User logs in → backend returns a JWT.
2. `AuthContext` stores the token with the **LocalStorage API**.
3. `api()` attaches `Authorization: Bearer <token>` on every **Fetch** request.
4. Dashboard loads tasks with `GET /api/tasks`. Employees only receive their own tasks.
5. Search and filters (status, due date) run **in the client** with `useMemo` / array filters — no extra API round trip.
6. Dragging a card between columns calls `PUT /api/tasks/:id` with a new status (optimistic UI).
7. Dark mode class is applied on `<html>` and saved as `tm_theme` in LocalStorage.

### Web APIs used

| Web API | Where |
| --- | --- |
| Fetch | `src/api/client.js` |
| LocalStorage | JWT (`tm_token`) and theme (`tm_theme`) |
| HTML Drag and Drop | `KanbanBoard` / `TaskCard` |
| History (via React Router) | client-side routes |

### Styling

Tailwind CSS with `darkMode: "class"`, responsive grids, loading skeletons, and card layouts.

## Backend (short)

- `POST /api/auth/signup` / `POST /api/auth/login` — bcrypt hashes, JWT
- `GET/POST/PUT/DELETE /api/tasks` — role checks in middleware
- `GET /api/users` — employees for assignment (admin only)
- Persistence: `backend/data/db.json` via `utils/store.js`

## Interview talking points

- SPA vs multi-page: routing happens in the browser; Express is JSON-only.
- Why JWT in LocalStorage: simple for a demo; mention XSS as a tradeoff vs httpOnly cookies.
- Why client-side filter: instant UX; server still enforces who can *see* which tasks.
- Optimistic updates: UI moves first, then Fetch; rollback on error.
