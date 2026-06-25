import { useState } from "react";
import toast from "react-hot-toast";
import { AlertCircle, Hash, Search, Upload } from "lucide-react";
import DropZone from "../components/DropZone";
import ProofCard from "../components/ProofCard";
import { verifyByFile, verifyByHash } from "../services/api";

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
      const res =
        tab === 0
          ? hash.trim()
            ? await verifyByHash(hash.trim())
            : (() => {
                toast.error("Enter a hash.");
                throw new Error();
              })()
          : file
            ? await verifyByFile(file)
            : (() => {
                toast.error("Select a file.");
                throw new Error();
              })();

      setResult(res);
      if (res.exists) toast.success("Proof found.");
      else toast.error("No proof found for this file.");
    } catch (err) {
      if (err?.response?.data?.detail) toast.error(err.response.data.detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell pt-3 sm:pt-4 lg:pt-5 pb-10 sm:pb-14 lg:pb-16">
      <div className="mx-auto max-w-3xl text-center mb-8">
        <p className="section-kicker mb-3 justify-center">Verification</p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-shelby-text leading-tight">
          Check a proof record.
        </h1>
        <p className="text-sm sm:text-base text-shelby-muted max-w-xl mx-auto leading-relaxed mt-3">
          Verify a registered file by pasting its SHA-256 hash or by selecting
          the original file.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42rem)_1fr] gap-6 lg:gap-8 items-start">
        <div className="panel p-4 sm:p-6 space-y-5 min-w-0">
          <div className="grid grid-cols-2 rounded-2xl border border-shelby-border bg-shelby-bg/60 p-1 gap-1">
            {TABS.map((label, i) => {
              const active = tab === i;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setTab(i);
                    setResult(null);
                  }}
                  className={`min-h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    active
                      ? "bg-shelby-accent text-shelby-onAccent font-semibold"
                      : "text-shelby-muted hover:text-shelby-text hover:bg-shelby-surface2"
                  }`}
                >
                  {i === 0 ? <Hash size={15} /> : <Upload size={15} />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {tab === 0 ? (
            <div className="space-y-2">
              <label className="text-xs font-mono text-shelby-muted uppercase tracking-widest">
                SHA-256 Hash
              </label>
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Paste SHA-256 hash here..."
                className="w-full bg-shelby-bg border border-shelby-border rounded-xl px-4 py-3.5 text-sm font-mono text-shelby-text placeholder-shelby-muted/45 focus:outline-none focus:border-shelby-accent transition-colors"
              />
            </div>
          ) : (
            <DropZone onFile={setFile} file={file} label="Drop the original file to verify its proof" />
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className={`w-full min-h-12 rounded-xl font-sans font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "bg-shelby-surface2 text-shelby-muted border border-shelby-border cursor-not-allowed"
                : "bg-shelby-accent text-shelby-onAccent hover:brightness-110 accent-glow active:scale-[0.99]"
            }`}
          >
            <Search size={16} />
            {loading ? "Verifying..." : "Verify Proof"}
          </button>
        </div>

        <aside className="panel p-5 lg:sticky lg:top-24">
          <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-4">What is checked</p>
          <div className="space-y-3">
            {[
              ["Hash match", "The submitted hash is compared with saved proof records."],
              ["Metadata", "File name, type, size, storage ID, and timestamp are returned when found."],
              ["Aptos link", "Recorded transaction links open in the Aptos explorer."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-shelby-border bg-shelby-bg/45 p-3">
                <p className="text-sm font-semibold text-shelby-text">{title}</p>
                <p className="text-xs text-shelby-muted leading-relaxed mt-1">{body}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {result && (
        <div className="mt-6 max-w-3xl animate-slide-up">
          {result.exists ? (
            <ProofCard proof={result.proof} />
          ) : (
            <div className="panel p-6 sm:p-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-shelby-error/10 border border-shelby-error/30 flex items-center justify-center">
                <AlertCircle size={24} className="text-shelby-error" />
              </div>
              <p className="font-display text-xl font-bold text-shelby-text">No proof found</p>
              <p className="text-sm text-shelby-muted max-w-sm mx-auto">
                This file is not registered in Shelby Proof-of-Data yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
