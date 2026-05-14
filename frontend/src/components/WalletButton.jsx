import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useWalletModal } from "../context/WalletModalContext";

function truncate(addr) {
  if (!addr) return "";
  const str = typeof addr === "string" ? addr : addr.toString();
  return `${str.slice(0, 6)}…${str.slice(-4)}`;
}

export default function WalletButton({ large = false }) {
  const { account, connected, disconnect } = useWallet();
  const { openModal } = useWalletModal();
  const [showMenu, setShowMenu] = useState(false);

  // Connected state
  if (connected && account) {
    const addressStr = typeof account.address === "string"
      ? account.address
      : account.address?.toString() ?? "";

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu((o) => !o)}
          className={`flex items-center gap-2 rounded-xl border border-shelby-success/30 bg-shelby-success/10 text-shelby-success font-mono hover:bg-shelby-success/20 transition-all
            ${large ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-shelby-success animate-pulse" />
          {truncate(addressStr)}
          <ChevronDown size={12} />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-shelby-border shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-shelby-border">
                <p className="text-xs text-shelby-muted">Connected wallet</p>
                <p className="text-xs font-mono text-shelby-text mt-0.5 truncate">
                  {addressStr}
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

  // Not connected — open modal
  return (
    <button
      onClick={openModal}
      className={`flex items-center gap-2 rounded-xl bg-shelby-accent text-shelby-bg font-semibold hover:brightness-110 transition-all accent-glow
        ${large ? "px-6 py-3 text-sm" : "px-3 py-1.5 text-xs"}`}
    >
      <Wallet size={large ? 16 : 13} />
      Connect Wallet
    </button>
  );
}
