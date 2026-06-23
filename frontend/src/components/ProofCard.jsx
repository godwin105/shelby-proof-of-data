import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  HardDrive,
  Hash,
  Link as LinkIcon,
} from "lucide-react";

function Field({ icon: Icon, label, value, mono = false, link = null }) {
  return (
    <div className="min-w-0 rounded-xl border border-shelby-border bg-shelby-bg/55 p-3">
      <span className="flex items-center gap-1.5 text-[0.68rem] text-shelby-muted uppercase tracking-widest font-mono">
        <Icon size={12} className="shrink-0" /> {label}
      </span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-1 text-xs sm:text-sm text-shelby-accent hover:underline flex items-center gap-1 min-w-0 ${
            mono ? "font-mono" : ""
          }`}
        >
          <span className="truncate">{value}</span>
          <ExternalLink size={12} className="shrink-0" />
        </a>
      ) : (
        <span className={`mt-1 block text-xs sm:text-sm text-shelby-text break-words ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export default function ProofCard({ proof }) {
  const ts = new Date(proof.timestamp);
  const isAnchored = Boolean(proof.aptos_tx_hash);
  const aptosExplorer = proof.aptos_tx_hash
    ? `https://explorer.aptoslabs.com/txn/${proof.aptos_tx_hash}?network=testnet`
    : null;
  const shelbyDashboard = proof.owner_address
    ? `https://explorer.shelby.xyz/testnet/account/${proof.owner_address}`
    : null;

  return (
    <div className="panel p-4 sm:p-6 accent-glow animate-slide-up space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-xs text-shelby-muted font-mono uppercase tracking-widest mb-1">
            Proof of Existence
          </p>
          <h3 className="font-display text-lg sm:text-xl font-bold text-shelby-text break-words">
            {proof.file_name}
          </h3>
        </div>
        <span
          className={`w-fit inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border whitespace-nowrap ${
            isAnchored
              ? "bg-shelby-success/10 text-shelby-success border-shelby-success/25"
              : "bg-shelby-warning/10 text-shelby-warning border-shelby-warning/30"
          }`}
        >
          {isAnchored ? <CheckCircle2 size={13} /> : <Clock size={13} />}
          {isAnchored ? "ANCHORED" : "STORED"}
        </span>
      </div>

      {!isAnchored && (
        <div className="rounded-xl border border-shelby-warning/25 bg-shelby-warning/10 p-3 text-xs text-shelby-warning leading-relaxed">
          The file was stored and saved for verification, but no Aptos transaction hash was returned.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field icon={Hash} label="SHA-256 Hash" value={proof.file_hash} mono />
        <Field icon={Clock} label="Timestamp" value={ts.toUTCString()} />
        {proof.owner_address && <Field icon={CheckCircle2} label="Owner Wallet" value={proof.owner_address} mono />}
        <Field icon={FileText} label="File Type" value={proof.file_type || "Unknown"} />
        <Field icon={HardDrive} label="File Size" value={formatBytes(proof.file_size)} />
        <Field
          icon={LinkIcon}
          label="Shelby Blob ID"
          value={proof.shelby_blob_id}
          mono
          link={proof.shelby_blob_url}
        />
        {proof.aptos_tx_hash && (
          <Field
            icon={ExternalLink}
            label="Aptos Transaction"
            value={`${proof.aptos_tx_hash.slice(0, 14)}...`}
            mono
            link={aptosExplorer}
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(proof.file_hash)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-shelby-border bg-shelby-surface px-4 py-2.5 text-sm font-medium text-shelby-text hover:border-shelby-accent/40 transition-colors"
        >
          <Copy size={14} />
          Copy hash
        </button>
        {aptosExplorer && (
          <a
            href={aptosExplorer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-shelby-border bg-shelby-surface px-4 py-2.5 text-sm font-medium text-shelby-text hover:border-shelby-accent/40 transition-colors"
          >
            <ExternalLink size={14} />
            Open Aptos explorer
          </a>
        )}
        {shelbyDashboard && (
          <a
            href={shelbyDashboard}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-shelby-accent/40 bg-shelby-accent/10 px-4 py-2.5 text-sm font-medium text-shelby-accent hover:bg-shelby-accent/20 transition-colors"
          >
            <ExternalLink size={14} />
            View on Shelby
          </a>
        )}
      </div>
    </div>
  );
}
