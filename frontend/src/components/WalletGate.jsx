import { Wallet, ExternalLink, Coins } from "lucide-react";
import { useAptosWallet } from "../hooks/useAptosWallet";

export default function WalletGate() {
  const { connect, isInstalled } = useAptosWallet();

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 text-center accent-glow">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center">
        <Wallet size={28} className="text-shelby-accent" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold text-shelby-text">
          Connect Your Wallet
        </h2>
        <p className="text-sm text-shelby-muted max-w-sm mx-auto leading-relaxed">
          To generate a proof, connect your{" "}
          <span className="text-shelby-text font-medium">Petra wallet</span>.
          Your wallet signs the upload and pays storage fees — no middleman.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="bg-shelby-bg rounded-xl p-4 border border-shelby-border space-y-1">
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-shelby-accent" />
            <span className="text-xs font-mono text-shelby-muted uppercase tracking-widest">Petra Wallet</span>
          </div>
          <p className="text-sm font-semibold text-shelby-text">Required</p>
          <p className="text-xs text-shelby-muted">Signs your storage transactions</p>
          {!isInstalled && (
            <a href="https://petra.app" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-shelby-accent hover:underline mt-1">
              Install Petra <ExternalLink size={10} />
            </a>
          )}
        </div>

        <div className="bg-shelby-bg rounded-xl p-4 border border-shelby-border space-y-1">
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-shelby-accent" />
            <span className="text-xs font-mono text-shelby-muted uppercase tracking-widest">Tokens</span>
          </div>
          <p className="text-sm font-semibold text-shelby-text">ShelbyUSD + APT</p>
          <p className="text-xs text-shelby-muted">ShelbyUSD for storage · APT for gas</p>
          <a href="https://shelby.xyz" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-shelby-accent hover:underline mt-1">
            Get ShelbyUSD <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        {isInstalled ? (
          <button onClick={connect}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all accent-glow">
            <Wallet size={16} /> Connect Petra Wallet
          </button>
        ) : (
          <a href="https://petra.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all">
            <ExternalLink size={16} /> Install Petra Wallet
          </a>
        )}
      </div>

      <p className="text-xs text-shelby-muted font-mono">
        Make sure Petra is set to <span className="text-shelby-accent">Testnet</span> for development
      </p>
    </div>
  );
}
