import { ExternalLink, Clock, Hash, FileText, HardDrive, Link as LinkIcon } from "lucide-react";

function Field({ icon: Icon, label, value, mono = false, link = null }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="flex items-center gap-1.5 text-xs text-shelby-muted uppercase tracking-widest font-mono">
        <Icon size={11} className="shrink-0" /> {label}
      </span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs sm:text-sm text-shelby-accent hover:underline flex items-center gap-1 break-all ${mono ? "font-mono" : ""}`}
        >
          <span className="truncate">{value}</span>
          <ExternalLink size={11} className="shrink-0" />
        </a>
      ) : (
        <span className={`text-xs sm:text-sm text-shelby-text break-all ${mono ? "font-mono" : ""}`}>
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
  const aptosExplorer = proof.aptos_tx_hash
    ? `https://explorer.aptoslabs.com/txn/${proof.aptos_tx_hash}?network=devnet`
    : null;

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 accent-glow animate-slide-up space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-shelby-muted font-mono uppercase tracking-widest mb-1">
            Proof of Existence
          </p>
          <h3 className="font-display text-base sm:text-lg font-bold text-shelby-text truncate">
            {proof.file_name}
          </h3>
        </div>
        <span className="shrink-0 text-xs font-mono px-2 py-1 rounded-full bg-shelby-success/10 text-shelby-success border border-shelby-success/20 whitespace-nowrap">
          ✓ PROVEN
        </span>
      </div>

      <div className="border-t border-shelby-border" />

      {/* Fields — single column on mobile, two on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field icon={Hash} label="SHA-256 Hash" value={proof.file_hash} mono />
        <Field icon={Clock} label="Timestamp" value={ts.toUTCString()} />
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
            value={`${proof.aptos_tx_hash.slice(0, 14)}…`}
            mono
            link={aptosExplorer}
          />
        )}
      </div>
    </div>
  );
}
