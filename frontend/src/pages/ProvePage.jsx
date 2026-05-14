import { useState } from "react";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import WalletGate from "../components/WalletGate";
import { useWalletSigner } from "../hooks/useWalletSigner";
import { computeSHA256, submitProof } from "../services/api";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export default function ProvePage() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const { signer, connected, account } = useWalletSigner();

  async function handleProve() {
    if (!file) return toast.error("Please select a file first.");
    if (!signer) return toast.error("Please connect your wallet first.");

    setLoading(true);
    setProof(null);
    setStep(1);

    try {
      await delay(300);
      const fileHash = await computeSHA256(file);
      setStep(2);
      await delay(400);
      setStep(3);
      await delay(300);

      const result = await submitProof({
        fileHash,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        shelbyBlobId: `shelby-pending-${Date.now()}`,
        shelbyBlobUrl: null,
        // No user details collected — proof is on-chain only
      });

      setStep(4);
      setProof(result.proof);

      if (result.success) toast.success("Proof recorded on Aptos! ✓");
      else toast("This file already has a proof record.", { icon: "ℹ️" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to record proof.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null); setProof(null); setStep(0);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-shelby-accent" />
          Proof of existence
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-shelby-text mb-3">
          Prove a file
        </h1>
        <p className="text-sm text-shelby-muted max-w-lg leading-relaxed">
          Upload any file to generate a tamper-proof SHA-256 fingerprint anchored
          on the Aptos blockchain. No personal data collected.
        </p>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left — upload */}
        <div className="space-y-5">
          {!connected ? (
            <WalletGate />
          ) : (
            <>
              {/* Wallet badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-shelby-success/5 border border-shelby-success/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-shelby-success animate-pulse shrink-0" />
                <p className="text-xs font-mono text-shelby-success truncate max-w-xs">
                  {account?.address?.toString()}
                </p>
              </div>

              {!proof && (
                <div className="space-y-4">
                  <DropZone onFile={setFile} file={file} />

                  {loading && (
                    <div className="space-y-3">
                      <StepIndicator currentStep={step} />
                    </div>
                  )}

                  {!loading && (
                    <p className="text-xs text-shelby-muted">
                      Proof is hashed locally and anchored on{" "}
                      <span className="text-shelby-text">Aptos</span>
                    </p>
                  )}

                  <button
                    onClick={handleProve}
                    disabled={!file || loading}
                    className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
                      flex items-center justify-center gap-2
                      ${!file || loading
                        ? "bg-shelby-border text-shelby-muted cursor-not-allowed"
                        : "bg-shelby-accent text-shelby-bg hover:brightness-110 accent-glow active:scale-[0.99]"
                      }`}
                  >
                    <Shield size={15} />
                    {loading ? "Recording proof…" : "Generate Proof"}
                  </button>
                </div>
              )}

              {proof && (
                <div className="space-y-3">
                  <ProofCard proof={proof} />
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:border-shelby-accent/30 text-sm font-medium transition-all"
                  >
                    Prove another file
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right — info panel (hidden when proof is shown) */}
        {!proof && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest">
              What you get
            </p>
            {[
              { label: "SHA-256 Hash", desc: "Unique fingerprint of your file" },
              { label: "Aptos Transaction", desc: "On-chain proof with timestamp" },
              { label: "Shelby Blob ID", desc: "Decentralized storage reference" },
              { label: "Proof Certificate", desc: "Shareable verification record" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-shelby-accent mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-shelby-text">{label}</p>
                  <p className="text-xs text-shelby-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
