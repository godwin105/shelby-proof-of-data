import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
import WalletButton from "./WalletButton";

const links = [
  { to: "/", label: "Prove" },
  { to: "/verify", label: "Verify" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-shelby-border w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-shelby-accent/10 border border-shelby-accent/30 flex items-center justify-center group-hover:bg-shelby-accent/20 transition-colors">
            <ShieldCheck size={14} className="text-shelby-accent" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-shelby-text">
            Shelby <span className="text-shelby-accent">PoD</span>
          </span>
        </Link>

        {/* Desktop nav + wallet */}
        <div className="hidden sm:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                  ${pathname === to
                    ? "bg-shelby-accent/10 text-shelby-accent border border-shelby-accent/20"
                    : "text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface"
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <WalletButton />
        </div>

        {/* Mobile: wallet + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <WalletButton />
          <button
            className="p-1.5 rounded-lg text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-shelby-border bg-shelby-surface px-4 py-2 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${pathname === to
                  ? "bg-shelby-accent/10 text-shelby-accent border border-shelby-accent/20"
                  : "text-shelby-muted hover:text-shelby-text hover:bg-shelby-bg"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
