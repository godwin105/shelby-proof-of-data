import { ShieldCheck, Wallet } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

export default function WalletGate() {
  const { openModal } = useWalletModal();

  return (
    <div className="panel p-6 sm:p-8 space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-shelby-accent/10 border border-shelby-accent/25 flex items-center justify-center">
        <ShieldCheck size={22} className="text-shelby-accent" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-xl font-bold text-shelby-text">Connect your Aptos wallet</h3>
        <p className="text-sm text-shelby-muted leading-relaxed">
          Your wallet signs the upload and attaches the proof to your address.
          Private keys never touch this app.
        </p>
      </div>
      <button
        type="button"
        onClick={openModal}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all accent-glow"
      >
        <Wallet size={15} />
        Connect Wallet
      </button>
      <p className="text-xs font-mono text-shelby-muted">
        Supports Petra, OKX, Martian, and compatible Aptos wallets
      </p>
    </div>
  );
}
