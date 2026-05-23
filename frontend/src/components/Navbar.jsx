import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Diamond, Menu, Moon, Sun, X } from "lucide-react";
import WalletButton from "./WalletButton";

const links = [
  { to: "/", label: "Home" },
  { to: "/prove", label: "Prove" },
  { to: "/verify", label: "Verify" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("shelby-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-shelby-border bg-shelby-bg/90 backdrop-blur-xl">
      <div className="page-shell h-16 flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-9 h-9 flex items-center justify-center">
            <Diamond size={19} className="text-shelby-accent" />
          </div>
          <span className="font-display font-bold text-2xl leading-none text-shelby-text whitespace-nowrap">
            Shelby <span className="text-shelby-accent">PoD</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 mx-auto font-mono">
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`py-2 text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "text-shelby-text"
                    : "text-shelby-muted hover:text-shelby-text"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-10 w-10 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface transition-colors grid place-items-center"
          >
            <ThemeIcon size={17} />
          </button>
          <WalletButton />
        </div>

        <div className="flex md:hidden items-center gap-2 ml-auto min-w-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-10 w-10 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface transition-colors grid place-items-center shrink-0"
          >
            <ThemeIcon size={17} />
          </button>
          <WalletButton compact />
          <button
            type="button"
            aria-label="Toggle navigation"
            className="h-10 w-10 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:bg-white/5 transition-colors grid place-items-center shrink-0"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-shelby-border bg-shelby-bg/95">
          <div className="page-shell py-3 grid grid-cols-2 gap-2">
            {links.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "text-shelby-onAccent bg-shelby-accent"
                      : "text-shelby-muted bg-shelby-surface hover:text-shelby-text"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
