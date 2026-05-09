import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

function truncate(addr) {
  if (!addr) return "";
  const str = typeof addr === "string" ? addr : addr.toString();
  return `${str.slice(0, 6)}…${str.slice(-4)}`;
}

export default function WalletButton({ large = false }) {
  const { account, connected, connect, disconnect, wallets } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

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

  const hasWallets = wallets?.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => hasWallets ? setShowMenu((o) => !o) : window.open("https://petra.app", "_blank")}
        className={`flex items-center gap-2 rounded-xl bg-shelby-accent text-shelby-bg font-semibold hover:brightness-110 transition-all accent-glow
          ${large ? "px-6 py-3 text-sm" : "px-3 py-1.5 text-xs"}`}
      >
        {hasWallets
          ? <><Wallet size={large ? 16 : 13} /> Connect Wallet</>
          : <><ExternalLink size={large ? 16 : 13} /> Install Petra</>
        }
      </button>

      {showMenu && hasWallets && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-shelby-border shadow-xl z-50 overflow-hidden">
            <p className="px-4 py-3 text-xs text-shelby-muted border-b border-shelby-border">
              Select a wallet
            </p>
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => { connect(wallet.name); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-shelby-text hover:bg-shelby-surface transition-colors"
              >
                {wallet.icon && typeof wallet.icon === "string" && (
                  <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 rounded" />
                )}
                {wallet.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}