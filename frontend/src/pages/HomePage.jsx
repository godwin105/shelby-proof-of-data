import { useState } from "react";
import toast from "react-hot-toast";
import { Shield, Zap, Wallet } from "lucide-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { Account } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import { computeSHA256, submitProof } from "../services/api";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Get the Aptos signer for Shelby uploads.
 * Priority: env private key → error (wallet signing not yet supported by SDK)
 */
function getSigner() {
  const key = import.meta.env.VITE_APTOS_PRIVATE_KEY;
  if (key && key !== "0x_your_testnet_private_key_here") {
    try {
      return Account.fromPrivateKey({ privateKey: key });
    } catch {
      // fall through
    }
  }
  // Generate ephemeral account — needs testnet APT to work
  return Account.generate();
}

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);

  const { connected } = useWallet();

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
        });
        setStep(4);
        setProof(result.proof);
        if (result.success) toast.success("Proof anchored on Aptos! ✓");
        else toast("This file already has a proof record.", { icon: "ℹ️" });
      } catch (err) {
        toast.error(err?.response?.data?.detail || "Failed to record proof.");
        setStep(0);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      const msg = err?.message || "Unknown error";
      if (msg.includes("401") || msg.includes("Unauthorized")) {
        toast.error("Shelby API auth failed. Check VITE_APTOS_API_KEY in your .env file.");
      } else if (msg.includes("insufficient") || msg.includes("balance")) {
        toast.error("Wallet has insufficient APT. Fund your testnet account first.");
      } else {
        toast.error(`Shelby upload failed: ${msg}`);
      }
      setStep(0);
      setLoading(false);
    },
  });

  async function handleProve() {
    if (!file) return toast.error("Please select a file first.");
    setLoading(true);
    setProof(null);
    setCurrentFile(file);
    setStep(1);
    try {
      await delay(300);
      setStep(2);
      const fileData = new Uint8Array(await file.arrayBuffer());
      const signer = getSigner();
      uploadBlobs.mutate({
        signer,
        blobs: [{ blobName: file.name, blobData: fileData }],
        expirationMicros: Date.now() * 1000 + 30 * 24 * 60 * 60 * 1_000_000,
      });
    } catch {
      toast.error("Failed to prepare upload.");
      setStep(0);
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null); setProof(null); setStep(0); setCurrentFile(null);
  }

  const hasEnvKey = import.meta.env.VITE_APTOS_PRIVATE_KEY &&
    import.meta.env.VITE_APTOS_PRIVATE_KEY !== "0x_your_testnet_private_key_here";

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

      {/* Setup warning if no env key */}
      {!hasEnvKey && (
        <div className="glass rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5 space-y-2">
          <p className="text-xs font-mono text-yellow-400 font-semibold uppercase tracking-widest">
            ⚠ Setup Required
          </p>
          <p className="text-xs text-shelby-muted leading-relaxed">
            To upload files, you need a funded Aptos testnet account and an API key.
            Create a <code className="text-yellow-400">frontend/.env</code> file — see{" "}
            <code className="text-shelby-accent">.env.example</code> for instructions.
          </p>
          <div className="text-xs text-shelby-muted space-y-1 pt-1 border-t border-shelby-border">
            <p>1. Get free API key → <span className="text-shelby-accent">developers.aptoslabs.com</span></p>
            <p>2. Install Aptos CLI → create & fund testnet account</p>
            <p>3. Add both keys to <code className="text-yellow-400">frontend/.env</code></p>
          </div>
        </div>
      )}

      {/* Wallet status */}
      {!connected && (
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-shelby-accent/10">
          <Wallet size={16} className="text-shelby-accent shrink-0" />
          <p className="text-xs text-shelby-muted">
            Connect your <span className="text-shelby-text">Petra wallet</span> via the top-right button to sign proofs with your own account.
          </p>
        </div>
      )}

      {/* Upload card */}
      {!proof && (
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-5">
          <DropZone onFile={setFile} file={file} />
          {loading && <StepIndicator currentStep={step} />}
          <button
            onClick={handleProve}
            disabled={!file || loading || uploadBlobs.isPending}
            className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
              flex items-center justify-center gap-2
              ${!file || loading || uploadBlobs.isPending
                ? "bg-shelby-border text-shelby-muted cursor-not-allowed"
                : "bg-shelby-accent text-shelby-bg hover:brightness-110 accent-glow active:scale-[0.99]"}`}
          >
            <Shield size={16} />
            {loading || uploadBlobs.isPending ? "Anchoring proof…" : "Generate Proof"}
          </button>
        </div>
      )}

      {proof && (
        <div className="space-y-4">
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
