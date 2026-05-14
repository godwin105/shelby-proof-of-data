import { ShieldCheck, Wallet } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

export default function WalletGate() {
  const { openModal } = useWalletModal();

  return (
    <div className="glass rounded-2xl p-8 space-y-5">
      <div className="w-12 h-12 rounded-xl bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center">
        <ShieldCheck size={22} className="text-shelby-accent" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold text-shelby-text">
          Wallet required
        </h3>
        <p className="text-sm text-shelby-muted leading-relaxed">
          Connect your Aptos wallet to generate tamper-proof proofs.
          Your wallet signs each upload — no private keys stored.
        </p>
      </div>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all"
      >
        <Wallet size={15} />
        Connect Wallet
      </button>
      <p className="text-xs font-mono text-shelby-muted">
        Supports Petra · OKX · Martian · any Aptos wallet
      </p>
    </div>
  );
}
