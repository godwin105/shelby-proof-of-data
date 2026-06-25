import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ExternalLink, X } from "lucide-react";
import toast from "react-hot-toast";
import { useWalletModal } from "../context/WalletModalContext";

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

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
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !connecting) closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal, connecting]);

  if (!isOpen) return null;

  const isSocial = (name) =>
    ["google", "apple", "continue"].some((key) => name.toLowerCase().includes(key));

  // Petra first, then other extension wallets, social last
  const sorted = [...wallets].sort((a, b) => {
    const aP = a.name.toLowerCase().includes("petra");
    const bP = b.name.toLowerCase().includes("petra");
    const aS = isSocial(a.name);
    const bS = isSocial(b.name);
    if (aP && !bP) return -1;
    if (!aP && bP) return 1;
    if (aS && !bS) return 1;
    if (!aS && bS) return -1;
    return a.name.localeCompare(b.name);
  });

  const extensionWallets = sorted.filter((wallet) => !isSocial(wallet.name));
  const socialWallets = sorted.filter((wallet) => isSocial(wallet.name));

  async function handleConnect(walletName) {
    setConnecting(walletName);
    try {
      await connect(walletName);
      closeModal();
    } catch (err) {
      const msg = err?.message ?? "";
      if (!msg.toLowerCase().includes("cancel") && !msg.toLowerCase().includes("reject")) {
        toast.error(msg || "Failed to connect wallet.");
      }
    } finally {
      setConnecting(null);
    }
  }

  const walletButton = (wallet, soft = false) => {
    const busy = connecting === wallet.name;
    return (
      <button
        key={wallet.name}
        type="button"
        disabled={!!connecting}
        onClick={() => handleConnect(wallet.name)}
        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left border ${
          busy
            ? "border-shelby-accent bg-shelby-accent/10"
            : soft
            ? "bg-shelby-bg/60 border-shelby-border hover:border-shelby-accent/45"
            : "bg-shelby-surface border-shelby-border hover:border-shelby-accent/45 hover:bg-shelby-accent/5"
        } ${connecting && !busy ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <WalletIcon wallet={wallet} />
        <span className="text-base font-semibold text-shelby-text truncate flex-1">
          {busy ? "Connecting…" : wallet.name}
        </span>
        {busy && (
          <div className="w-4 h-4 rounded-full border-2 border-shelby-accent border-t-transparent animate-spin shrink-0" />
        )}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-8"
      onClick={() => { if (!connecting) closeModal(); }}
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
                onClick={() => { if (!connecting) closeModal(); }}
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

          {isMobile && (
            <div className="px-5 sm:px-8 pb-6">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
                Mobile wallet
              </p>
              <a
                href={`https://petra.app/explore?link=${encodeURIComponent(window.location.origin)}`}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left border bg-shelby-surface border-shelby-border hover:border-shelby-accent/45 hover:bg-shelby-accent/5"
              >
                <img
                  src="https://petra.app/favicon.ico"
                  alt="Petra"
                  className="w-9 h-9 rounded-xl object-contain shrink-0"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-shelby-text">Petra Mobile</p>
                  <p className="text-xs text-shelby-muted mt-0.5">Opens in Petra app</p>
                </div>
                <ExternalLink size={14} className="text-shelby-muted shrink-0 ml-auto" />
              </a>
            </div>
          )}

          {!isMobile && wallets.length === 0 && (
            <div className="px-5 sm:px-8 pb-8 text-center space-y-4">
              <p className="text-sm text-shelby-muted">No wallets detected in this browser.</p>
              <a
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-shelby-accent text-shelby-onAccent text-sm font-semibold hover:brightness-110 transition-all"
              >
                Install Petra Wallet
              </a>
            </div>
          )}

          <div className="px-5 sm:px-8 pb-8 pt-2">
            <p className="text-xs font-mono text-shelby-muted">
              {isMobile
                ? "Use Petra Mobile or social sign-in to connect on mobile"
                : "Supports Petra, OKX, Martian, and compatible Aptos wallets"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
