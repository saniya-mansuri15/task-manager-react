import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          TaskFlow
        </Link>
        {user && (
          <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
              }
            >
              Dashboard
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/create-task"
                className={({ isActive }) =>
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                }
              >
                Create Task
              </NavLink>
            )}
          </nav>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user && (
            <>
              <span className="hidden text-xs text-slate-500 sm:inline">
                {user.name} · {user.role}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-slate-900"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
