import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

function truncate(addr) {
  if (!addr) return "";
  const str = typeof addr === "string" ? addr : addr.toString();
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
}

export default function WalletButton({ compact = false }) {
  const { account, connected, disconnect } = useWallet();
  const { openModal } = useWalletModal();
  const [showMenu, setShowMenu] = useState(false);

  if (connected && account) {
    const addressStr =
      typeof account.address === "string"
        ? account.address
        : account.address?.toString() ?? "";

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu((open) => !open)}
          className="h-10 max-w-[9.25rem] flex items-center gap-2 px-3 rounded-xl border border-shelby-success/30 bg-shelby-success/10 text-shelby-success text-xs font-mono hover:bg-shelby-success/20 transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-shelby-success animate-pulse shrink-0" />
          <span className="truncate">{truncate(addressStr)}</span>
          <ChevronDown size={12} className="shrink-0" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-shelby-border shadow-xl z-50 overflow-hidden bg-shelby-surface">
              <div className="px-4 py-3 border-b border-shelby-border">
                <p className="text-xs text-shelby-muted">Connected wallet</p>
                <p className="text-xs font-mono text-shelby-text mt-1 truncate">{addressStr}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
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

  return (
    <button
      type="button"
      onClick={openModal}
      className={`h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-shelby-accent text-shelby-onAccent font-semibold hover:brightness-110 transition-all accent-glow ${
        compact ? "w-10 px-0" : "px-4 text-sm"
      }`}
      aria-label="Connect wallet"
    >
      <Wallet size={15} />
      {!compact && <span>Connect Wallet</span>}
    </button>
  );
}
