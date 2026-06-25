import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Shield, WalletCards, CheckCircle2, Database, Hash, ReceiptText } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { AccountAddress } from "@aptos-labs/ts-sdk";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import WalletGate from "../components/WalletGate";
import { computeSHA256FromBuffer, submitProof, fetchBlobTxHash } from "../services/api";
import { shelbyClient } from "../lib/shelby";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SUMMARY = [
  { icon: Hash, label: "SHA-256 Hash", desc: "Local file fingerprint" },
  { icon: Database, label: "Shelby Blob ID", desc: "Stored on hot storage" },
  { icon: WalletCards, label: "Aptos Transaction", desc: "Wallet-signed anchor" },
  { icon: ReceiptText, label: "Proof Record", desc: "Saved for verification" },
];

const STEP_HELP = {
  1: "Creating the file fingerprint locally.",
  2: "Approve the transaction in your wallet.",
  3: "Uploading file to Shelby — large files may take several minutes.",
  4: "Confirming the Aptos anchor.",
  5: "Proof metadata saved for verification.",
};

export default function ProvePage() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [fileHash, setFileHash] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const pendingProofRef = useRef(null);
  const capturedTxHashRef = useRef(null);
  const progressTimerRef = useRef(null);

  const { account, signAndSubmitTransaction, connected } = useWallet();

  const uploadBlobs = useUploadBlobs({
    client: shelbyClient,
    onSuccess: async (uploadedBlobs) => {
      try {
        clearInterval(progressTimerRef.current);
        setUploadProgress(100);
        setStep((prev) => Math.max(prev, 3));
        const pendingProof = pendingProofRef.current;
        if (!pendingProof) throw new Error("Missing proof details. Please try again.");

        await delay(400);

        const blobResult = uploadedBlobs?.[0];
        const shelbyBlobId = blobResult?.blobId ?? blobResult?.name ?? pendingProof.file.name;
        if (!shelbyBlobId) throw new Error("Shelby upload did not return a blob ID.");

        const shelbyBlobUrl = blobResult?.url ?? null;
        let aptosTxHash =
          blobResult?.aptosTransactionHash ??
          blobResult?.transactionHash ??
          capturedTxHashRef.current;

        // Blob was already registered on-chain (SDK skipped signAndSubmitTransaction).
        // Fall back to indexer to retrieve the original tx hash.
        if (!aptosTxHash) {
          aptosTxHash = await fetchBlobTxHash(
            pendingProof.ownerAddress,
            pendingProof.file.name,
          );
        }

        if (aptosTxHash) setStep(4);

        const result = await submitProof({
          fileHash: pendingProof.fileHash,
          fileName: pendingProof.file.name,
          fileSize: pendingProof.file.size,
          fileType: pendingProof.file.type,
          ownerAddress: pendingProof.ownerAddress,
          shelbyBlobId,
          shelbyBlobUrl,
          aptosTxHash,
        });

        setStep(5);
        setProof(result.proof);

        if (result.success && aptosTxHash) toast.success("File stored on Shelby and anchored on Aptos.");
        else if (result.success) toast.success("File stored on Shelby. Aptos transaction hash was not returned.");
        else toast("This file already has a proof record.");
      } catch (err) {
        toast.error(
          err?.response?.data?.detail ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to save proof.",
        );
        setStep(0);
      } finally {
        setLoading(false);
        pendingProofRef.current = null;
        capturedTxHashRef.current = null;
      }
    },

    onError: (err) => {
      clearInterval(progressTimerRef.current);
      setUploadProgress(0);
      const msg = err?.message || "";
      if (msg.includes("rejected") || msg.includes("cancel")) {
        toast.error("Transaction rejected in wallet.");
      } else if (msg.includes("insufficient") || msg.includes("balance")) {
        toast.error("Insufficient ShelbyUSD or APT in your wallet.");
      } else {
        toast.error(`Upload failed: ${msg}`);
      }
      setStep(0);
      setLoading(false);
      pendingProofRef.current = null;
      capturedTxHashRef.current = null;
    },
  });

  const handleProve = useCallback(async () => {
    if (!file) return toast.error("Please select a file first.");
    if (!connected) return toast.error("Please connect your wallet first.");
    if (!account || !signAndSubmitTransaction) {
      return toast.error("Wallet not ready. Please reconnect.");
    }

    setLoading(true);
    setProof(null);
    setFileHash("");
    setUploadProgress(0);
    capturedTxHashRef.current = null;
    setStep(1);

    try {
      await delay(300);
      // Read file once — reuse the same buffer for hashing and blob upload
      const arrayBuffer = await file.arrayBuffer();
      const computedHash = await computeSHA256FromBuffer(arrayBuffer);
      const blobData = new Uint8Array(arrayBuffer);
      setFileHash(computedHash);

      const addressStr =
        typeof account.address === "string"
          ? account.address
          : account.address?.toString();

      const accountAddress = AccountAddress.fromString(addressStr);
      pendingProofRef.current = { file, fileHash: computedHash, ownerAddress: addressStr };

      const trackedSignAndSubmitTransaction = async (...args) => {
        const response = await signAndSubmitTransaction(...args);
        capturedTxHashRef.current = response?.hash ?? response?.transactionHash ?? null;
        setStep(3);
        // Start simulated progress: estimate ~1.5 MB/s upload, cap at 92%
        const estimatedMs = Math.max((file.size / (1.5 * 1024 * 1024)) * 1000, 4000);
        const intervalMs = 300;
        const increment = (intervalMs / estimatedMs) * 92;
        setUploadProgress(0);
        progressTimerRef.current = setInterval(() => {
          setUploadProgress((p) => Math.min(p + increment, 92));
        }, intervalMs);
        return response;
      };

      setStep(2);
      uploadBlobs.mutate({
        signer: {
          account: accountAddress,
          signAndSubmitTransaction: trackedSignAndSubmitTransaction,
        },
        blobs: [{ blobName: file.name, blobData }],
        expirationMicros: Date.now() * 1000 + 365 * 24 * 60 * 60 * 1000 * 1000,
      });
    } catch (err) {
      toast.error(err?.message || "Failed to prepare upload.");
      setStep(0);
      setLoading(false);
      pendingProofRef.current = null;
      capturedTxHashRef.current = null;
    }
  }, [file, connected, account, signAndSubmitTransaction, uploadBlobs]);

  function handleReset() {
    setFile(null);
    setProof(null);
    setStep(0);
    setFileHash("");
    pendingProofRef.current = null;
    capturedTxHashRef.current = null;
  }

  const addressStr = account?.address
    ? typeof account.address === "string"
      ? account.address
      : account.address.toString()
    : "";

  return (
    <div className="page-shell pt-3 sm:pt-4 lg:pt-5 pb-10 sm:pb-14 lg:pb-16">
      <div className="mb-8 sm:mb-10 max-w-3xl">
        <p className="section-kicker mb-3">Proof workspace</p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-shelby-text leading-tight">
          Generate a tamper-proof file proof.
        </h1>
        <p className="text-sm sm:text-base text-shelby-muted max-w-2xl leading-relaxed mt-3">
          Select a file, sign with your wallet, and receive a proof record that
          can be verified later by hash or original file.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_23rem] gap-6 lg:gap-8 items-start">
        <div className="min-w-0 space-y-5">
          {!connected ? (
            <WalletGate />
          ) : (
            <>
              <div className="panel p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-mono uppercase tracking-widest text-shelby-muted">Connected wallet</p>
                    <p className="text-xs sm:text-sm font-mono text-shelby-success truncate mt-1">{addressStr}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-shelby-success">
                    <span className="w-2 h-2 rounded-full bg-shelby-success animate-pulse" />
                    Ready to sign
                  </span>
                </div>
              </div>

              {!proof && (
                <div className="panel p-4 sm:p-5 space-y-5">
                  <DropZone onFile={setFile} file={file} />

                  {loading && (
                    <div className="space-y-3">
                      <StepIndicator currentStep={step} />
                      <p className="text-xs text-center text-shelby-muted font-mono animate-pulse">
                        {STEP_HELP[step] || "Preparing proof..."}
                      </p>
                      {step === 3 && (
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full rounded-full bg-shelby-surface2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-shelby-accent transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-[0.68rem] font-mono text-shelby-muted text-right">
                            {Math.round(uploadProgress)}%
                          </p>
                        </div>
                      )}
                      {fileHash && (
                        <div className="rounded-xl border border-shelby-border bg-shelby-bg/55 p-3">
                          <p className="text-[0.68rem] font-mono uppercase tracking-widest text-shelby-muted">
                            SHA-256
                          </p>
                          <p className="mt-1 text-xs font-mono text-shelby-accent break-all">{fileHash}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProve}
                    disabled={!file || loading || uploadBlobs.isPending}
                    className={`w-full min-h-12 rounded-xl font-sans font-semibold text-sm transition-all duration-200
                      flex items-center justify-center gap-2 ${
                        !file || loading || uploadBlobs.isPending
                          ? "bg-shelby-surface2 text-shelby-muted border border-shelby-border cursor-not-allowed"
                          : "bg-shelby-accent text-shelby-onAccent hover:brightness-110 accent-glow active:scale-[0.99]"
                      }`}
                  >
                    <Shield size={16} />
                    {loading || uploadBlobs.isPending ? "Creating proof..." : "Generate Proof"}
                  </button>
                </div>
              )}

              {proof && (
                <div className="space-y-3">
                  <ProofCard proof={proof} />
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl border border-shelby-border bg-shelby-surface text-shelby-muted hover:text-shelby-text hover:border-shelby-accent/40 text-sm font-medium transition-all"
                  >
                    Prove another file
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {!proof && (
          <aside className="panel p-5 lg:sticky lg:top-24">
            <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-4">
              Proof output
            </p>
            <div className="space-y-3">
              {SUMMARY.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-shelby-border bg-shelby-bg/45 p-3">
                  <div className="w-9 h-9 rounded-xl bg-shelby-accent/10 border border-shelby-accent/25 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-shelby-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-shelby-text">{label}</p>
                    <p className="text-xs text-shelby-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-shelby-border mt-5 pt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[0.68rem] font-mono uppercase tracking-widest text-shelby-muted">Storage</p>
                <p className="text-sm font-mono text-shelby-text mt-1">ShelbyUSD</p>
              </div>
              <div>
                <p className="text-[0.68rem] font-mono uppercase tracking-widest text-shelby-muted">Gas</p>
                <p className="text-sm font-mono text-shelby-text mt-1">APT</p>
              </div>
            </div>
          </aside>
        )}

        {proof && (
          <aside className="panel p-5 lg:sticky lg:top-24">
            <CheckCircle2
              size={22}
              className={proof.aptos_tx_hash ? "text-shelby-success" : "text-shelby-warning"}
            />
            <p className="font-display text-xl font-bold text-shelby-text mt-3">
              {proof.aptos_tx_hash ? "Proof anchored" : "Proof stored"}
            </p>
            <p className="text-sm text-shelby-muted leading-relaxed mt-2">
              {proof.aptos_tx_hash
                ? "Save the file hash or share the proof details so the anchored record can be checked later."
                : "Save the file hash. The record can be verified locally, but no Aptos transaction hash was returned."}
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
