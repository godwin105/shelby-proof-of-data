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
    <header className="sticky top-0 z-50 glass border-b border-shelby-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-shelby-accent/10 border border-shelby-accent/30 flex items-center justify-center group-hover:bg-shelby-accent/20 transition-colors">
            <ShieldCheck size={16} className="text-shelby-accent" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-shelby-text">
            Shelby <span className="text-shelby-accent">PoD</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                  ${pathname === to
                    ? "bg-shelby-accent/10 text-shelby-accent border border-shelby-accent/20"
                    : "text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface"}`}>
                {label}
              </Link>
            ))}
          </nav>
          <WalletButton />
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <WalletButton />
          <button
            className="p-2 rounded-lg text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface transition-colors"
            onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-shelby-border bg-shelby-surface px-4 py-3 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${pathname === to
                  ? "bg-shelby-accent/10 text-shelby-accent border border-shelby-accent/20"
                  : "text-shelby-muted hover:text-shelby-text hover:bg-shelby-bg"}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
