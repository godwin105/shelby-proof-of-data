import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAptosWallet } from "../hooks/useAptosWallet";

function truncate(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WalletButton({ large = false }) {
  const { account, connected, isInstalled, connect, disconnect } = useAptosWallet();
  const [showMenu, setShowMenu] = useState(false);

  // Connected
  if (connected && account) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu((o) => !o)}
          className={`flex items-center gap-2 rounded-xl border border-shelby-success/30 bg-shelby-success/10 text-shelby-success font-mono hover:bg-shelby-success/20 transition-all
            ${large ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-shelby-success animate-pulse" />
          {truncate(account.address)}
          <ChevronDown size={12} />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-shelby-border shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-shelby-border">
                <p className="text-xs text-shelby-muted">Connected — Petra Wallet</p>
                <p className="text-xs font-mono text-shelby-text mt-0.5 truncate">
                  {account.address}
                </p>
              </div>
              <button
                onClick={() => { disconnect(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-shelby-error hover:bg-shelby-error/10 transition-colors"
              >
                <LogOut size={14} /> Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Not connected
  return (
    <div className="relative">
      <button
        onClick={() => isInstalled ? connect() : window.open("https://petra.app", "_blank")}
        className={`flex items-center gap-2 rounded-xl bg-shelby-accent text-shelby-bg font-semibold hover:brightness-110 transition-all accent-glow
          ${large ? "px-6 py-3 text-sm" : "px-3 py-1.5 text-xs"}`}
      >
        {isInstalled ? (
          <><Wallet size={large ? 16 : 13} /> Connect Wallet</>
        ) : (
          <><ExternalLink size={large ? 16 : 13} /> Install Petra</>
        )}
      </button>
    </div>
  );
}
