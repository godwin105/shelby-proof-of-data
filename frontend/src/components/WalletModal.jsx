import { useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { X } from "lucide-react";
import { useWalletModal } from "../context/WalletModalContext";

function WalletIcon({ wallet }) {
  const icon = wallet.icon;
  const iconSrc = typeof icon === "string"
    ? icon
    : icon?.light ?? icon?.dark ?? null;

  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt={wallet.name}
        className="w-8 h-8 rounded-lg object-contain"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-shelby-border flex items-center justify-center text-shelby-muted text-xs font-mono font-bold">
      {wallet.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function WalletModal() {
  const { isOpen, closeModal } = useWalletModal();
  const { connect, wallets } = useWallet();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
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
    ["google", "apple", "continue"].some((k) => name.toLowerCase().includes(k));

  const extensionWallets = wallets.filter((w) => !isSocial(w.name));
  const socialWallets = wallets.filter((w) => isSocial(w.name));

  function handleConnect(walletName) {
    connect(walletName);
    closeModal();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: "#0E1215", border: "1px solid #1E2428" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 pt-8 pb-5">
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-display text-2xl font-bold text-shelby-text">
              Connect a wallet
            </h2>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-shelby-muted hover:text-shelby-text hover:bg-shelby-border transition-colors mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-shelby-muted leading-relaxed">
            Shelby PoD uses your Aptos wallet for both sign-in and
            proving your files on Shelby.
          </p>
        </div>

        {/* Extension wallets */}
        {extensionWallets.length > 0 && (
          <div className="px-7 pb-5">
            <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
              Use a wallet extension
            </p>
            <div className="flex flex-col gap-2">
              {extensionWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left group"
                  style={{
                    background: "#161B1F",
                    border: "1px solid #1E2428",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid #00E5CC33";
                    e.currentTarget.style.background = "#00E5CC08";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid #1E2428";
                    e.currentTarget.style.background = "#161B1F";
                  }}
                >
                  <WalletIcon wallet={wallet} />
                  <span className="text-sm font-semibold text-shelby-text">
                    {wallet.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Social wallets */}
        {socialWallets.length > 0 && (
          <div className="px-7 pb-5">
            <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3">
              Or sign in with
            </p>
            <div className="flex flex-col gap-2">
              {socialWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-left"
                  style={{
                    background: "#161B1F",
                    border: "1px solid #1E2428",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid #1E2428CC";
                    e.currentTarget.style.background = "#1E2428";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid #1E2428";
                    e.currentTarget.style.background = "#161B1F";
                  }}
                >
                  <WalletIcon wallet={wallet} />
                  <span className="text-sm font-semibold text-shelby-text">
                    {wallet.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No wallets */}
        {wallets.length === 0 && (
          <div className="px-7 pb-6 text-center space-y-4">
            <p className="text-sm text-shelby-muted">No wallets detected in this browser.</p>
            <a
              href="https://petra.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-shelby-accent text-shelby-bg text-sm font-semibold hover:brightness-110 transition-all"
            >
              Install Petra Wallet →
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="px-7 pb-7">
          <p
            className="text-xs font-mono"
            style={{ color: "#3A4A58" }}
          >
            Supports Petra · OKX · Martian · any Aptos-compatible wallet
          </p>
        </div>
      </div>
    </div>
  );
}
