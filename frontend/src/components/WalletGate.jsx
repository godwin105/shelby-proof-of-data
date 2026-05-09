import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, ExternalLink, Coins } from "lucide-react";

export default function WalletGate() {
  const { connect, wallets } = useWallet();
  const hasWallets = wallets?.length > 0;

  return (
    <div className="glass rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 text-center accent-glow">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center">
        <Wallet size={24} className="text-shelby-accent" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-lg sm:text-xl font-bold text-shelby-text">
          Connect Your Wallet
        </h2>
        <p className="text-xs sm:text-sm text-shelby-muted max-w-xs mx-auto leading-relaxed">
          Connect your <span className="text-shelby-text font-medium">Petra wallet</span> to
          generate proofs. Your wallet signs uploads and pays storage fees directly.
        </p>
      </div>

      {/* What you need */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
        <div className="bg-shelby-bg rounded-xl p-3 sm:p-4 border border-shelby-border space-y-1">
          <div className="flex items-center gap-1.5">
            <Wallet size={12} className="text-shelby-accent shrink-0" />
            <span className="text-xs font-mono text-shelby-muted uppercase tracking-widest truncate">Petra</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-shelby-text">Required</p>
          <p className="text-xs text-shelby-muted leading-relaxed">Signs transactions</p>
          {!hasWallets && (
            <a href="https://petra.app" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-shelby-accent hover:underline">
              Install <ExternalLink size={9} />
            </a>
          )}
        </div>

        <div className="bg-shelby-bg rounded-xl p-3 sm:p-4 border border-shelby-border space-y-1">
          <div className="flex items-center gap-1.5">
            <Coins size={12} className="text-shelby-accent shrink-0" />
            <span className="text-xs font-mono text-shelby-muted uppercase tracking-widest truncate">Tokens</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-shelby-text">ShelbyUSD + APT</p>
          <p className="text-xs text-shelby-muted leading-relaxed">Storage + gas fees</p>
          <a href="https://shelby.xyz" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-shelby-accent hover:underline">
            Get tokens <ExternalLink size={9} />
          </a>
        </div>
      </div>

      {/* Connect button or wallet list */}
      <div className="space-y-2">
        {hasWallets ? (
          <div className="space-y-2">
            {wallets.map((wallet) => (
  <button
    key={wallet.name}
    onClick={() => connect(wallet.name)}
    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all accent-glow"
  >
    {wallet.icon && typeof wallet.icon === "string" && (
      <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 rounded" />
    )}
    Connect {wallet.name}
  </button>
))}
          </div>
        ) : (
          <a
            href="https://petra.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all"
          >
            <ExternalLink size={16} /> Install Petra Wallet
          </a>
        )}
      </div>

      <p className="text-xs text-shelby-muted font-mono">
        Set Petra to <span className="text-shelby-accent">Testnet</span> for development
      </p>
    </div>
  );
}
