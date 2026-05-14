import { useState } from "react";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { Account } from "@aptos-labs/ts-sdk";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import WalletGate from "../components/WalletGate";
import { useWalletSigner } from "../hooks/useWalletSigner";
import { computeSHA256, submitProof } from "../services/api";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Creates an Aptos signer from VITE_APTOS_PRIVATE_KEY for Shelby uploads.
// The user pays ShelbyUSD + APT gas from this account.
function getSigner() {
  const key = import.meta.env.VITE_APTOS_PRIVATE_KEY;
  if (key && key.length > 10) {
    try {
      return Account.fromPrivateKey({ privateKey: key });
    } catch (e) {
      console.error("Invalid VITE_APTOS_PRIVATE_KEY:", e);
    }
  }
  return Account.generate();
}

export default function ProvePage() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);

  const { connected, account } = useWalletSigner();

  const uploadBlobs = useUploadBlobs({
    onSuccess: async (uploadedBlobs) => {
      try {
        setStep(3);
        await delay(400);

        // Extract blob info from Shelby response
        const blobResult = uploadedBlobs?.[0];
        const shelbyBlobId  = blobResult?.blobId  ?? blobResult?.name  ?? `shelby-${Date.now()}`;
        const shelbyBlobUrl = blobResult?.url      ?? null;
        const aptosTxHash   = blobResult?.aptosTransactionHash
          ?? blobResult?.transactionHash
          ?? null;

        // Hash the file
        const fileHash = await computeSHA256(currentFile);

        // Send to backend
        const result = await submitProof({
          fileHash,
          fileName:     currentFile.name,
          fileSize:     currentFile.size,
          fileType:     currentFile.type,
          shelbyBlobId,
          shelbyBlobUrl,
          aptosTxHash,
        });

        setStep(4);
        setProof(result.proof);

        if (result.success) toast.success("Proof stored on Shelby & anchored on Aptos! ✓");
        else toast("This file already has a proof record.", { icon: "ℹ️" });
      } catch (err) {
        toast.error(err?.response?.data?.detail || "Failed to save proof.");
        setStep(0);
      } finally {
        setLoading(false);
      }
    },

    onError: (err) => {
      const msg = err?.message || "";
      if (msg === "USER_REJECTED" || msg.includes("rejected")) {
        toast.error("Transaction rejected in Petra wallet.");
      } else if (msg.includes("insufficient") || msg.includes("balance") || msg.includes("ShelbyUSD")) {
        toast.error("Insufficient ShelbyUSD or APT. Please fund your wallet.");
      } else if (msg.includes("401") || msg.includes("Unauthorized")) {
        toast.error("Shelby API auth failed. Check VITE_APTOS_API_KEY.");
      } else {
        toast.error(`Upload failed: ${msg}`);
      }
      setStep(0);
      setLoading(false);
    },
  });

  async function handleProve() {
    if (!file)   return toast.error("Please select a file first.");
    if (!connected) return toast.error("Please connect your wallet first.");

    setLoading(true);
    setProof(null);
    setCurrentFile(file);
    setStep(1);

    try {
      // Step 1 — hash file in browser
      await delay(300);
      setStep(2);

      // Step 2 — upload to Shelby (Petra popup will appear)
      const fileData = new Uint8Array(await file.arrayBuffer());
      const signer   = getSigner();

      uploadBlobs.mutate({
        signer,
        blobs: [{ blobName: file.name, blobData: fileData }],
        // Store for 365 days
        expirationMicros: Date.now() * 1000 + 365 * 24 * 60 * 60 * 1_000_000,
      });
    } catch (err) {
      toast.error("Failed to prepare upload.");
      setStep(0);
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null); setProof(null); setStep(0); setCurrentFile(null);
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
          Upload any file to generate a tamper-proof SHA-256 fingerprint stored
          on Shelby's decentralized network and anchored on the Aptos blockchain.
          No personal data collected.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left — upload */}
        <div className="space-y-5">
          {!connected ? (
            <WalletGate />
          ) : (
            <>
              {/* Connected wallet badge */}
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
                      {step === 2 && (
                        <p className="text-xs text-center text-shelby-muted font-mono animate-pulse">
                          Check your Petra wallet — approve the transaction…
                        </p>
                      )}
                    </div>
                  )}

                  {!loading && (
                    <p className="text-xs text-shelby-muted">
                      File stored on <span className="text-shelby-text">Shelby</span> ·
                      Hash anchored on <span className="text-shelby-text">Aptos</span> ·
                      Fees paid in <span className="text-shelby-text">ShelbyUSD + APT</span>
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
                    <Shield size={15} />
                    {loading || uploadBlobs.isPending
                      ? "Waiting for wallet approval…"
                      : "Generate Proof"
                    }
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

        {/* Right — info panel */}
        {!proof && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest">
              What you get
            </p>
            {[
              { label: "SHA-256 Hash",       desc: "Unique cryptographic fingerprint of your file" },
              { label: "Shelby Blob ID",     desc: "File stored permanently on Shelby network" },
              { label: "Aptos Transaction",  desc: "On-chain timestamp — immutable proof" },
              { label: "Proof Certificate",  desc: "Shareable verification record" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-shelby-accent mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-shelby-text">{label}</p>
                  <p className="text-xs text-shelby-muted">{desc}</p>
                </div>
              </div>
            ))}

            <div className="border-t border-shelby-border pt-4 space-y-2">
              <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest">
                Fees
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-shelby-muted">Storage (Shelby)</span>
                <span className="text-xs font-mono text-shelby-text">ShelbyUSD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-shelby-muted">Gas (Aptos)</span>
                <span className="text-xs font-mono text-shelby-text">APT</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
