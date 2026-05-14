import { ShieldCheck, Wallet } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

export default function WalletGate() {
  const { openModal } = useWalletModal();

  return (
    <div className="glass rounded-2xl p-8 text-center space-y-6 accent-glow">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center">
        <ShieldCheck size={28} className="text-shelby-accent" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold text-shelby-text">
          Wallet required
        </h2>
        <p className="text-sm text-shelby-muted max-w-xs mx-auto leading-relaxed">
          Connect your Aptos wallet to generate tamper-proof proofs.
          Your wallet signs each upload directly — no private keys stored.
        </p>
      </div>

      {/* Connect button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all accent-glow"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>

      <p className="text-xs font-mono text-shelby-muted">
        Supports Petra · OKX · Martian · any Aptos wallet
      </p>
    </div>
  );
}
