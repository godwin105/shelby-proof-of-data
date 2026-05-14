import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-shelby-border"
      style={{ background: "rgba(10,13,15,0.92)", backdropFilter: "blur(12px)" }}>

      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">

        {/* Logo — left */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 mr-auto" onClick={() => setMenuOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-shelby-accent/10 border border-shelby-accent/30 flex items-center justify-center group-hover:bg-shelby-accent/20 transition-colors">
            <ShieldCheck size={13} className="text-shelby-accent" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-shelby-text">
            Shelby <span className="text-shelby-accent">PoD</span>
          </span>
        </Link>

        {/* Nav links — centered (desktop) */}
        <nav className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                ${pathname === to
                  ? "text-shelby-text"
                  : "text-shelby-muted hover:text-shelby-text"
                }`}
            >
              {label}
              {pathname === to && (
                <span className="block h-0.5 bg-shelby-accent rounded-full mt-0.5 mx-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* Wallet — right */}
        <div className="hidden sm:flex ml-auto">
          <WalletButton />
        </div>

        {/* Mobile hamburger */}
        <div className="flex sm:hidden items-center gap-2 ml-auto">
          <WalletButton />
          <button
            className="p-1.5 rounded-lg text-shelby-muted hover:text-shelby-text transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-shelby-border px-6 py-3 flex flex-col gap-1"
          style={{ background: "#0A0D0F" }}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${pathname === to
                  ? "text-shelby-accent bg-shelby-accent/5"
                  : "text-shelby-muted hover:text-shelby-text"
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
