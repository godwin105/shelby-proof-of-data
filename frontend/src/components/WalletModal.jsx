import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useWalletModal } from "../context/WalletModalContext";

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

function isSocial(name) {
  return ["google", "apple", "continue"].some((k) =>
    name.toLowerCase().includes(k)
  );
}

function isPetra(name) {
  return name.toLowerCase().includes("petra");
}

function sortWallets(wallets) {
  return [...wallets].sort((a, b) => {
    if (isPetra(a.name) && !isPetra(b.name)) return -1;
    if (!isPetra(a.name) && isPetra(b.name)) return 1;
    if (isSocial(a.name) && !isSocial(b.name)) return 1;
    if (!isSocial(a.name) && isSocial(b.name)) return -1;
    return a.name.localeCompare(b.name);
  });
}

function WalletIcon({ wallet }) {
  const icon = wallet.icon;
  const src = typeof icon === "string" ? icon : icon?.light ?? icon?.dark ?? null;
  if (src) {
    return <img src={src} alt={wallet.name} className="w-9 h-9 rounded-xl object-contain shrink-0" />;
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-shelby-surface border border-shelby-border flex items-center justify-center text-shelby-muted text-xs font-mono font-bold shrink-0">
      {wallet.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function WalletItem({ wallet, connecting, onConnect }) {
  const isThis = connecting === wallet.name;
  const busy = connecting !== null;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onConnect(wallet.name)}
      className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left border
        ${isThis
          ? "border-shelby-accent bg-shelby-accent/10"
          : "border-shelby-border bg-shelby-surface hover:border-shelby-accent/45 hover:bg-shelby-accent/5"
        }
        ${busy && !isThis ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      <WalletIcon wallet={wallet} />
      <span className="flex-1 text-base font-semibold text-shelby-text truncate">
        {isThis ? "Connecting…" : wallet.name}
      </span>
      {isThis && <Loader2 size={16} className="text-shelby-accent animate-spin shrink-0" />}
    </button>
  );
}

export default function WalletModal() {
  const { isOpen, closeModal } = useWalletModal();
  const { connect, wallets, connected } = useWallet();
  const [connecting, setConnecting] = useState(null);

  // Auto-close when wallet connects (handles redirect / social auth flows)
  useEffect(() => {
    if (connected && isOpen) {
      setConnecting(null);
      closeModal();
    }
  }, [connected, isOpen, closeModal]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !connecting) closeModal(); };
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

  const sorted = sortWallets(wallets);
  const extensionWallets = sorted.filter((w) => !isSocial(w.name));
  const socialWallets = sorted.filter((w) => isSocial(w.name));

  async function handleConnect(walletName) {
    setConnecting(walletName);
    try {
      await connect(walletName);
      closeModal();
    } catch (err) {
      const msg = err?.message || "";
      if (!msg.toLowerCase().includes("cancel") && !msg.toLowerCase().includes("reject")) {
        toast.error(msg || "Failed to connect wallet.");
      }
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-8"
      onClick={() => { if (!connecting) closeModal(); }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up bg-shelby-bg border border-shelby-border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 sm:px-8 pt-8 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-shelby-text">
                  Connect a wallet
                </h2>
                <p className="text-sm text-shelby-muted leading-relaxed mt-2">
                  {isMobile
                    ? "Use social sign-in or an Aptos-compatible wallet."
                    : "Select an Aptos wallet to sign proof transactions."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { if (!connecting) closeModal(); }}
                disabled={!!connecting}
                aria-label="Close"
                className="h-9 w-9 rounded-xl text-shelby-muted hover:text-shelby-text hover:bg-white/5 transition-colors grid place-items-center shrink-0 disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Extension / standard wallets — Petra first */}
          {extensionWallets.length > 0 && (
            <div className="px-5 sm:px-8 pb-5">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
                {isMobile ? "Detected wallets" : "Wallet extensions"}
              </p>
              <div className="flex flex-col gap-2.5">
                {extensionWallets.map((w) => (
                  <WalletItem
                    key={w.name}
                    wallet={w}
                    connecting={connecting}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Social / AptosConnect */}
          {socialWallets.length > 0 && (
            <div className="px-5 sm:px-8 pb-5">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
                Social sign-in
              </p>
              <div className="flex flex-col gap-2.5">
                {socialWallets.map((w) => (
                  <WalletItem
                    key={w.name}
                    wallet={w}
                    connecting={connecting}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No wallets */}
          {wallets.length === 0 && (
            <div className="px-5 sm:px-8 pb-8 text-center space-y-4">
              <p className="text-sm text-shelby-muted">
                {isMobile
                  ? "No wallets detected. Open this site inside the Petra or OKX mobile wallet browser."
                  : "No wallets detected. Install a browser extension wallet."}
              </p>
              <a
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-shelby-accent text-shelby-onAccent text-sm font-semibold hover:brightness-110 transition-all"
              >
                {isMobile ? "Get Petra Mobile" : "Install Petra Wallet"}
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 sm:px-8 py-4 border-t border-shelby-border">
            <p className="text-xs font-mono text-shelby-muted">
              Petra is listed first. All Aptos-compatible wallets detected in this browser are shown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
