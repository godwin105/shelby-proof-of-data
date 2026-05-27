import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Shield, WalletCards, CheckCircle2, Database, Hash, ReceiptText } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { AccountAddress } from "@aptos-labs/ts-sdk";

import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import StepIndicator from "../components/StepIndicator";
import WalletGate from "../components/WalletGate";
import { computeSHA256, submitProof } from "../services/api";
import { shelbyClient } from "../lib/shelby";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SUMMARY = [
  { icon: Hash, label: "SHA-256 Hash", desc: "Local file fingerprint" },
  { icon: Database, label: "Shelby Blob ID", desc: "Stored on hot storage" },
  { icon: WalletCards, label: "Aptos Transaction", desc: "Wallet-signed anchor" },
  { icon: ReceiptText, label: "Proof Record", desc: "Saved for verification" },
];

export default function ProvePage() {
  const [file, setFile] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);

  const { account, signAndSubmitTransaction, connected } = useWallet();

  const uploadBlobs = useUploadBlobs({
    client: shelbyClient,
    onSuccess: async (uploadedBlobs) => {
      try {
        setStep(3);
        await delay(400);

        const blobResult = uploadedBlobs?.[0];
        const shelbyBlobId = blobResult?.blobId ?? blobResult?.name ?? `shelby-${Date.now()}`;
        const shelbyBlobUrl = blobResult?.url ?? null;
        const aptosTxHash =
          blobResult?.aptosTransactionHash ?? blobResult?.transactionHash ?? null;

        const fileHash = await computeSHA256(currentFile);

        const result = await submitProof({
          fileHash,
          fileName: currentFile.name,
          fileSize: currentFile.size,
          fileType: currentFile.type,
          shelbyBlobId,
          shelbyBlobUrl,
          aptosTxHash,
        });

        setStep(4);
        setProof(result.proof);

        if (result.success) toast.success("File stored on Shelby and anchored on Aptos.");
        else toast("This file already has a proof record.");
      } catch (err) {
        toast.error(err?.response?.data?.detail || "Failed to save proof.");
        setStep(0);
      } finally {
        setLoading(false);
      }
    },

    onError: (err) => {
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
    setCurrentFile(file);
    setStep(1);

    try {
      await delay(300);
      setStep(2);

      const arrayBuffer = await file.arrayBuffer();
      const blobData = new Uint8Array(arrayBuffer);

      const addressStr =
        typeof account.address === "string"
          ? account.address
          : account.address?.toString();

      const accountAddress = AccountAddress.fromString(addressStr);

      uploadBlobs.mutate({
        signer: {
          account: accountAddress,
          signAndSubmitTransaction,
        },
        blobs: [{ blobName: file.name, blobData }],
        expirationMicros: Date.now() * 1000 + 365 * 24 * 60 * 60 * 1000 * 1000,
      });
    } catch (err) {
      toast.error("Failed to prepare upload.");
      setStep(0);
      setLoading(false);
    }
  }, [file, connected, account, signAndSubmitTransaction, uploadBlobs]);

  function handleReset() {
    setFile(null);
    setProof(null);
    setStep(0);
    setCurrentFile(null);
  }

  const addressStr = account?.address
    ? typeof account.address === "string"
      ? account.address
      : account.address.toString()
    : "";

  return (
    <div className="page-shell pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-14 lg:pb-16">
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
                      {step === 2 && (
                        <p className="text-xs text-center text-shelby-muted font-mono animate-pulse">
                          Approve the transaction in your wallet.
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProve}
                    disabled={!file || loading || uploadBlobs.isPending}
                    className={`w-full min-h-12 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
                      flex items-center justify-center gap-2 ${
                        !file || loading || uploadBlobs.isPending
                          ? "bg-shelby-surface2 text-shelby-muted border border-shelby-border cursor-not-allowed"
                          : "bg-shelby-accent text-shelby-onAccent hover:brightness-110 accent-glow active:scale-[0.99]"
                      }`}
                  >
                    <Shield size={16} />
                    {loading || uploadBlobs.isPending ? "Waiting for wallet approval..." : "Generate Proof"}
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
            <CheckCircle2 size={22} className="text-shelby-success" />
            <p className="font-display text-xl font-bold text-shelby-text mt-3">Proof created</p>
            <p className="text-sm text-shelby-muted leading-relaxed mt-2">
              Save the file hash or share the proof details so the record can be
              checked from the verify screen.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
