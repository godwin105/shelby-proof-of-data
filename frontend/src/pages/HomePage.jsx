import { useState } from "react";
import toast from "react-hot-toast";
import { Shield, Zap } from "lucide-react";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import WalletGate from "../components/WalletGate";
import { useWalletSigner } from "../hooks/useWalletSigner";
import { computeSHA256, submitProof } from "../services/api";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export default function HomePage() {
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
      // Step 1 — Hash file in browser
      await delay(300);
      const fileHash = await computeSHA256(file);

      // Step 2 — Submit to backend
      // Backend handles Aptos recording + MySQL
      // Shelby blob will be added when testnet access is available
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
        ownerAddress: account?.address?.toString() ?? null,
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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-6 sm:space-y-8 animate-fade-in">

      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-shelby-accent/20 bg-shelby-accent/5 text-shelby-accent text-xs font-mono uppercase tracking-widest">
          <Zap size={9} /> Decentralized · Tamper-proof · Permanent
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-shelby-text leading-tight">
          Prove your file<br />
          <span className="text-shelby-accent">existed today.</span>
        </h1>
        <p className="text-shelby-muted text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed">
          Upload any file. Its SHA-256 fingerprint is stored on{" "}
          <span className="text-shelby-text">Shelby</span> and anchored on the{" "}
          <span className="text-shelby-text">Aptos blockchain</span>.
        </p>
      </div>

      {!connected && <WalletGate />}

      {connected && !proof && (
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-shelby-success/5 border border-shelby-success/20">
            <span className="w-2 h-2 rounded-full bg-shelby-success animate-pulse shrink-0" />
            <p className="text-xs font-mono text-shelby-success truncate">
              {account?.address?.toString()}
            </p>
          </div>

          <DropZone onFile={setFile} file={file} />

          {loading && <StepIndicator currentStep={step} />}

          {!loading && (
            <p className="text-xs text-center text-shelby-muted">
              Proof is hashed locally and anchored on{" "}
              <span className="text-shelby-text">Aptos</span>
            </p>
          )}

          <button
            onClick={handleProve}
            disabled={!file || loading}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
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
        <div className="space-y-3 sm:space-y-4">
          <ProofCard proof={proof} />
          <button onClick={handleReset}
            className="w-full py-3 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:border-shelby-accent/30 text-sm font-medium transition-all">
            Prove another file
          </button>
        </div>
      )}
    </div>
  );
}