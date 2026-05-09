import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

function truncate(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WalletButton() {
  const { connect, disconnect, account, connected, wallets } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  // Connected state — show address + disconnect option
  if (connected && account) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-shelby-success/30 bg-shelby-success/10 text-shelby-success text-xs font-mono hover:bg-shelby-success/20 transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-shelby-success animate-pulse" />
          {truncate(account.address)}
          <ChevronDown size={12} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 glass rounded-xl border border-shelby-border shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-shelby-border">
              <p className="text-xs text-shelby-muted">Connected wallet</p>
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
        )}
      </div>
    );
  }

  // Not connected — show connect button with wallet list
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-shelby-accent text-shelby-bg text-xs font-semibold hover:brightness-110 transition-all"
      >
        <Wallet size={13} /> Connect Wallet
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-52 glass rounded-xl border border-shelby-border shadow-xl z-50 overflow-hidden">
          <p className="px-4 py-3 text-xs text-shelby-muted border-b border-shelby-border">
            Select a wallet
          </p>
          {wallets?.length > 0 ? (
            wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => { connect(wallet.name); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-shelby-text hover:bg-shelby-surface transition-colors"
              >
                {wallet.icon && (
                  <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 rounded" />
                )}
                {wallet.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-center space-y-2">
              <p className="text-xs text-shelby-muted">No wallets detected</p>
              <a
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-shelby-accent hover:underline block"
              >
                Install Petra Wallet →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
