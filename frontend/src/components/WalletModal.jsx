import { useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { X } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

function WalletIcon({ wallet }) {
  const icon = wallet.icon;
  const iconSrc = typeof icon === "string" ? icon : icon?.light ?? icon?.dark ?? null;

  if (iconSrc) {
    return <img src={iconSrc} alt={wallet.name} className="w-9 h-9 rounded-xl object-contain shrink-0" />;
  }

  return (
    <div className="w-9 h-9 rounded-xl bg-shelby-surface border border-shelby-border flex items-center justify-center text-shelby-muted text-xs font-mono font-bold shrink-0">
      {wallet.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function WalletModal() {
  const { isOpen, closeModal } = useWalletModal();
  const { connect, wallets } = useWallet();

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const isSocial = (name) =>
    ["google", "apple", "continue"].some((key) => name.toLowerCase().includes(key));

  const extensionWallets = wallets.filter((wallet) => !isSocial(wallet.name));
  const socialWallets = wallets.filter((wallet) => isSocial(wallet.name));

  function handleConnect(walletName) {
    connect(walletName);
    closeModal();
  }

  const walletButton = (wallet, soft = false) => (
    <button
      key={wallet.name}
      type="button"
      onClick={() => handleConnect(wallet.name)}
      className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left border ${
        soft
          ? "bg-shelby-bg/60 border-shelby-border hover:border-shelby-accent2/45"
          : "bg-shelby-surface border-shelby-border hover:border-shelby-accent/45 hover:bg-shelby-accent/5"
      }`}
    >
      <WalletIcon wallet={wallet} />
      <span className="text-base font-semibold text-shelby-text truncate">{wallet.name}</span>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-8"
      onClick={closeModal}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up bg-shelby-bg border border-shelby-border shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-5 sm:px-8 pt-8 pb-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-shelby-text">
                  Connect a wallet
                </h2>
                <p className="text-sm text-shelby-muted leading-relaxed mt-2">
                  Shelby PoD uses your Aptos wallet for signing proof transactions.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close wallet modal"
                className="h-9 w-9 rounded-xl text-shelby-muted hover:text-shelby-text hover:bg-white/5 transition-colors grid place-items-center shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {extensionWallets.length > 0 && (
            <div className="px-5 sm:px-8 pb-6">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
                Wallet extensions
              </p>
              <div className="flex flex-col gap-2.5">
                {extensionWallets.map((wallet) => walletButton(wallet))}
              </div>
            </div>
          )}

          {socialWallets.length > 0 && (
            <div className="px-5 sm:px-8 pb-6">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
                Social sign-in
              </p>
              <div className="flex flex-col gap-2.5">
                {socialWallets.map((wallet) => walletButton(wallet, true))}
              </div>
            </div>
          )}

          {wallets.length === 0 && (
            <div className="px-5 sm:px-8 pb-8 text-center space-y-4">
              <p className="text-sm text-shelby-muted">No wallets detected in this browser.</p>
              <a
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all"
              >
                Install Petra Wallet
              </a>
            </div>
          )}

          <div className="px-5 sm:px-8 pb-8 pt-2">
            <p className="text-xs font-mono text-shelby-muted">
              Supports Petra, OKX, Martian, and compatible Aptos wallets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
