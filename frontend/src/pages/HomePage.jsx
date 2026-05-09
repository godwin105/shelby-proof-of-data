import { useState } from "react";
import toast from "react-hot-toast";
import { Shield, Zap } from "lucide-react";
import { useUploadBlobs } from "@shelby-protocol/react";

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
  const [currentFile, setCurrentFile] = useState(null);

  // Get signer from connected Petra wallet — no private key needed
  const { signer, connected, account } = useWalletSigner();

  const uploadBlobs = useUploadBlobs({
    onSuccess: async (uploadedBlobs) => {
      try {
        setStep(3);
        await delay(400);

        const blobResult = uploadedBlobs?.[0];
        const shelbyBlobId = blobResult?.blobId ?? blobResult?.name ?? `shelby-${Date.now()}`;
        const shelbyBlobUrl = blobResult?.url ?? null;

        const fileHash = await computeSHA256(currentFile);
        const result = await submitProof({
          fileHash,
          fileName: currentFile.name,
          fileSize: currentFile.size,
          fileType: currentFile.type,
          shelbyBlobId,
          shelbyBlobUrl,
          ownerAddress: account?.address ?? null,
        });

        setStep(4);
        setProof(result.proof);

        if (result.success) {
          toast.success("Proof anchored on Aptos! ✓");
        } else {
          toast("This file already has a proof record.", { icon: "ℹ️" });
        }
      } catch (err) {
        toast.error(err?.response?.data?.detail || "Failed to record proof.");
        setStep(0);
      } finally {
        setLoading(false);
      }
    },

    onError: (err) => {
      const msg = err?.message || "Unknown error";

      if (msg === "USER_REJECTED") {
        toast.error("Transaction rejected in wallet.");
      } else if (msg.includes("401") || msg.includes("Unauthorized")) {
        toast.error("API auth failed. Check VITE_APTOS_API_KEY in your .env");
      } else if (msg.includes("insufficient") || msg.includes("balance") || msg.includes("ShelbyUSD")) {
        toast.error("Insufficient ShelbyUSD or APT in your wallet.");
      } else {
        toast.error(`Upload failed: ${msg}`);
      }

      setStep(0);
      setLoading(false);
    },
  });

  async function handleProve() {
    if (!file) return toast.error("Please select a file first.");
    if (!signer) return toast.error("Please connect your wallet first.");

    setLoading(true);
    setProof(null);
    setCurrentFile(file);
    setStep(1);

    try {
      await delay(300);
      setStep(2);

      const fileData = new Uint8Array(await file.arrayBuffer());

      // User's wallet signs and pays — Petra will show approval popup
      uploadBlobs.mutate({
        signer,
        blobs: [{ blobName: file.name, blobData: fileData }],
        // Store for 30 days
        expirationMicros: Date.now() * 1000 + 30 * 24 * 60 * 60 * 1_000_000,
      });
    } catch {
      toast.error("Failed to prepare upload.");
      setStep(0);
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setProof(null);
    setStep(0);
    setCurrentFile(null);
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-fade-in">

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-shelby-accent/20 bg-shelby-accent/5 text-shelby-accent text-xs font-mono uppercase tracking-widest">
          <Zap size={10} /> Decentralized · Tamper-proof · Permanent
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-shelby-text leading-tight">
          Prove your file<br />
          <span className="text-shelby-accent">existed today.</span>
        </h1>
        <p className="text-shelby-muted text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Upload any file. Its SHA-256 fingerprint is stored on{" "}
          <span className="text-shelby-text">Shelby</span> and anchored on the{" "}
          <span className="text-shelby-text">Aptos blockchain</span> — permanently.
        </p>
      </div>

      {/* Wallet not connected → show gate */}
      {!connected && <WalletGate />}

      {/* Wallet connected → show upload */}
      {connected && !proof && (
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-5">

          {/* Connected wallet badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-shelby-success/5 border border-shelby-success/20">
            <span className="w-2 h-2 rounded-full bg-shelby-success animate-pulse shrink-0" />
            <p className="text-xs font-mono text-shelby-success truncate">
              {account?.address}
            </p>
          </div>

          <DropZone onFile={setFile} file={file} />

          {loading && (
            <div className="space-y-3">
              <StepIndicator currentStep={step} />
              {step === 2 && (
                <p className="text-xs text-center text-shelby-muted font-mono animate-pulse">
                  Check your Petra wallet — approval required…
                </p>
              )}
            </div>
          )}

          {/* Fee notice */}
          {!loading && (
            <p className="text-xs text-center text-shelby-muted">
              A small <span className="text-shelby-text">ShelbyUSD</span> storage fee
              and <span className="text-shelby-text">APT</span> gas will be charged to your wallet
            </p>
          )}

          <button
            onClick={handleProve}
            disabled={!file || loading || uploadBlobs.isPending}
            className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
              flex items-center justify-center gap-2
              ${!file || loading || uploadBlobs.isPending
                ? "bg-shelby-border text-shelby-muted cursor-not-allowed"
                : "bg-shelby-accent text-shelby-bg hover:brightness-110 accent-glow active:scale-[0.99]"
              }`}
          >
            <Shield size={16} />
            {loading || uploadBlobs.isPending ? "Waiting for wallet approval…" : "Generate Proof"}
          </button>
        </div>
      )}

      {/* Proof result */}
      {proof && (
        <div className="space-y-4">
          <ProofCard proof={proof} />
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:border-shelby-accent/30 text-sm font-medium transition-all"
          >
            Prove another file
          </button>
        </div>
      )}
    </div>
  );
}
