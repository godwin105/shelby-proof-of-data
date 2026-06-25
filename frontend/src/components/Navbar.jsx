import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Menu, Moon, Share, Sun, X } from "lucide-react";
import WalletButton from "./WalletButton";
import { usePWAInstall } from "../hooks/usePWAInstall";

const links = [
  { to: "/", label: "Home" },
  { to: "/prove", label: "Prove" },
  { to: "/verify", label: "Verify" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme || "dark";
  });
  const { install, canInstall, isIOS, hasNativePrompt } = usePWAInstall();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("shelby-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-shelby-border bg-shelby-bg/90 backdrop-blur-xl">
      <div className="page-shell h-16 flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation"
          className="flex md:hidden h-10 w-10 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface2 transition-colors items-center justify-center shrink-0"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <img src="/favicon.svg" alt="Shelby PoD" className="w-9 h-9 object-contain" />
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
                className={`relative py-2 text-sm font-semibold transition-all duration-150
                  after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all after:duration-150
                  ${active
                    ? "text-shelby-accent after:bg-shelby-accent"
                    : "text-shelby-muted hover:text-shelby-text after:bg-transparent"
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
          {canInstall && (
            <button
              type="button"
              onClick={isIOS ? () => setShowIOSHint(true) : install}
              title="Install app"
              className="h-10 w-10 rounded-xl border border-shelby-accent/40 text-shelby-accent hover:bg-shelby-accent/10 transition-colors grid place-items-center shrink-0"
            >
              <Download size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-10 w-10 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface transition-colors grid place-items-center shrink-0"
          >
            <ThemeIcon size={17} />
          </button>
          <WalletButton compact />
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
      {showIOSHint && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0" onClick={() => setShowIOSHint(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-shelby-border bg-shelby-bg p-6 space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-shelby-text text-base">Install Shelby PoD</h3>
              <button type="button" onClick={() => setShowIOSHint(false)} className="text-shelby-muted hover:text-shelby-text"><X size={18} /></button>
            </div>
            <ol className="space-y-3 text-sm text-shelby-muted">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-shelby-accent/15 text-shelby-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Tap the <Share size={14} className="inline mx-1 text-shelby-accent" /> <strong className="text-shelby-text">Share</strong> button at the bottom of Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-shelby-accent/15 text-shelby-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong className="text-shelby-text">Add to Home Screen</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-shelby-accent/15 text-shelby-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Tap <strong className="text-shelby-text">Add</strong> — the app will appear on your home screen</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </header>
  );
}
