import { useState } from "react";
import toast from "react-hot-toast";
import { Search, Hash, Upload } from "lucide-react";
import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import { verifyByHash, verifyByFile } from "../services/api";

const TABS = ["By Hash", "By File"];

export default function VerifyPage() {
  const [tab, setTab] = useState(0);
  const [hash, setHash] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setResult(null);
    setLoading(true);
    try {
      const res = tab === 0
        ? (hash.trim() ? await verifyByHash(hash.trim()) : (() => { toast.error("Enter a hash."); throw new Error(); })())
        : (file ? await verifyByFile(file) : (() => { toast.error("Select a file."); throw new Error(); })());
      setResult(res);
      if (res.exists) toast.success("Proof found! ✓");
      else toast.error("No proof found for this file.");
    } catch (err) {
      if (err?.response?.data?.detail) toast.error(err.response.data.detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-shelby-text">
          Verify a <span className="text-shelby-accent">Proof</span>
        </h1>
        <p className="text-shelby-muted text-sm max-w-sm mx-auto">
          Check whether a file has been registered on Shelby and anchored on Aptos.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="flex rounded-xl overflow-hidden border border-shelby-border p-1 gap-1">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => { setTab(i); setResult(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                ${tab === i ? "bg-shelby-accent text-shelby-bg font-semibold" : "text-shelby-muted hover:text-shelby-text"}`}>
              {i === 0 ? <Hash size={14} /> : <Upload size={14} />}
              <span>{t}</span>
            </button>
          ))}
        </div>

        {tab === 0 ? (
          <div className="space-y-2">
            <label className="text-xs font-mono text-shelby-muted uppercase tracking-widest">SHA-256 Hash</label>
            <input type="text" value={hash} onChange={(e) => setHash(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Paste SHA-256 hash here…"
              className="w-full bg-shelby-bg border border-shelby-border rounded-xl px-4 py-3 text-sm font-mono text-shelby-text placeholder-shelby-muted/40 focus:outline-none focus:border-shelby-accent transition-colors" />
          </div>
        ) : (
          <DropZone onFile={setFile} file={file} label="Drop the original file to verify its proof" />
        )}

        <button onClick={handleVerify} disabled={loading}
          className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
            flex items-center justify-center gap-2
            ${loading ? "bg-shelby-border text-shelby-muted cursor-not-allowed"
              : "bg-shelby-accent text-shelby-bg hover:brightness-110 accent-glow active:scale-[0.99]"}`}>
          <Search size={16} />
          {loading ? "Verifying…" : "Verify Proof"}
        </button>
      </div>

      {result && (
        <div className="animate-slide-up">
          {result.exists ? <ProofCard proof={result.proof} /> : (
            <div className="glass rounded-2xl p-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-shelby-error/10 border border-shelby-error/30 flex items-center justify-center text-2xl">✕</div>
              <p className="font-display text-lg font-bold text-shelby-text">No Proof Found</p>
              <p className="text-sm text-shelby-muted max-w-xs mx-auto">This file has not been registered on Shelby Proof-of-Data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
