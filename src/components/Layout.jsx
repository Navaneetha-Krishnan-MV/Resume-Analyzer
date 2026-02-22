import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AiScannerLogo from "./AiScannerLogo";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const navClass = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
    ].join(" ");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 dark:from-[#05060b] dark:via-[#0b0f18] dark:to-[#121626] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-400/15" />
        <div className="absolute top-6 right-6 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-400/15" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl dark:bg-slate-700/20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-6 font-sans sm:px-8 lg:px-10">
        <header className="sticky top-6 z-30 rounded-3xl border border-white/60 bg-white/70 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5 sm:rounded-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
            <AiScannerLogo className="w-12 h-12" />
            <div>
              <p className="text-sm font-semibold tracking-wide">Resume Analyzer</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Precision Suite
              </p>
            </div>
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden flex-wrap items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2 py-1 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:flex">
                <NavLink className={navClass} to="/">
                  Home
                </NavLink>
                <NavLink className={navClass} to="/upload">
                  Upload
                </NavLink>
                <NavLink className={navClass} to="/analyze">
                  Analyze
                </NavLink>
              </nav>

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                aria-pressed={theme === "dark"}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              >
                {theme === "dark" ? "Dark" : "Light"}
                <span className="flex h-5 w-9 items-center rounded-full bg-slate-200 p-1 transition dark:bg-slate-700">
                  <span
                    className={`h-3 w-3 rounded-full bg-slate-900 transition dark:bg-white ${
                      theme === "dark" ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:hidden"
              >
                <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>

          <nav
            className={`mt-4 flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/80 p-3 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:hidden ${
              menuOpen ? "flex" : "hidden"
            }`}
          >
            <NavLink className={navClass} to="/">
              Home
            </NavLink>
            <NavLink className={navClass} to="/upload">
              Upload
            </NavLink>
            <NavLink className={navClass} to="/analyze">
              Analyze
            </NavLink>
          </nav>
        </header>

        <main className="flex flex-1 flex-col gap-10">{children}</main>

        <footer className="text-sm text-slate-500 dark:text-slate-400">
          Built for crisp, professional resume decisions.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
