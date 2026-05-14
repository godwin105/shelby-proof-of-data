import { Link } from "react-router-dom";
import { Shield, ArrowRight, Hash, Clock, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: Hash,
    title: "SHA-256 fingerprint",
    desc: "Every file gets a unique cryptographic hash — impossible to forge or reverse.",
  },
  {
    icon: Clock,
    title: "Permanent timestamp",
    desc: "The exact moment your proof was created is anchored on the Aptos blockchain forever.",
  },
  {
    icon: Globe,
    title: "Decentralized storage",
    desc: "Files live on Shelby's decentralized network — no central server, no single point of failure.",
  },
  {
    icon: Shield,
    title: "Publicly verifiable",
    desc: "Anyone can verify your proof using the original file or its hash — no account needed.",
  },
];

const USE_CASES = [
  { icon: "🎨", label: "Copyright" },
  { icon: "⚖️", label: "Legal docs" },
  { icon: "🔬", label: "Research" },
  { icon: "📰", label: "Journalism" },
  { icon: "🤖", label: "AI datasets" },
];

export default function HomePage() {
  return (
    <div className="w-full">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-shelby-accent" />
          Proof of existence · Aptos blockchain · Shelby Network
        </p>

        <h1 className="font-display font-extrabold leading-none mb-8">
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-shelby-text">
            Prove your file
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-shelby-text">
            existed.{" "}
            <em
              className="not-italic"
              style={{ color: "#00E5CC" }}
            >
              Forever.
            </em>
          </span>
        </h1>

        <p className="text-base sm:text-lg text-shelby-muted max-w-xl leading-relaxed mb-10">
          Upload any file — get a tamper-proof SHA-256 fingerprint stored on
          Shelby's decentralized network and anchored on the Aptos blockchain.
          Tied to your wallet, not to a service. No accounts, no lock-in.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/prove"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-shelby-accent text-shelby-bg font-semibold text-sm hover:brightness-110 transition-all accent-glow"
          >
            Prove a file <ArrowRight size={16} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-shelby-border text-shelby-muted hover:text-shelby-text hover:border-shelby-accent/30 text-sm font-medium transition-all"
          >
            Learn how it works
          </Link>
        </div>

        {/* Use case pills */}
        <div className="flex flex-wrap items-center gap-2 mt-10">
          <span className="text-xs text-shelby-muted font-mono mr-1">Used for:</span>
          {USE_CASES.map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-shelby-border text-xs text-shelby-muted"
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="border-t border-shelby-border" />

      {/* ── How it works ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-10">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-shelby-border rounded-2xl overflow-hidden">
          {[
            { n: "01", title: "Upload your file", body: "Select any file. It is hashed locally in your browser — the raw file never leaves your device unless you choose to store it." },
            { n: "02", title: "Store on Shelby", body: "Your file is stored as a blob on Shelby's decentralized hot-storage network, tied to your Aptos wallet address." },
            { n: "03", title: "Anchor on Aptos", body: "The SHA-256 hash and timestamp are written permanently on the Aptos blockchain. Immutable, public, and verifiable by anyone." },
          ].map(({ n, title, body }) => (
            <div key={n} className="bg-shelby-bg px-6 py-8 space-y-3">
              <span className="text-3xl font-display font-extrabold text-shelby-border">
                {n}
              </span>
              <p className="font-display font-bold text-shelby-text text-base">{title}</p>
              <p className="text-sm text-shelby-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="border-t border-shelby-border" />

      {/* ── Features ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-xs font-mono text-shelby-muted uppercase tracking-widest mb-10">
          Why Shelby PoD
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-9 h-9 rounded-lg bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-shelby-accent" />
              </div>
              <div>
                <p className="font-display font-semibold text-shelby-text text-sm mb-1">{title}</p>
                <p className="text-xs text-shelby-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="border-t border-shelby-border" />

      {/* ── CTA banner ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-shelby-text mb-2">
            Ready to prove your file?
          </h2>
          <p className="text-sm text-shelby-muted">
            Connect your Aptos wallet and generate your first proof in seconds.
          </p>
        </div>
        <Link
          to="/prove"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-shelby-accent text-shelby-bg font-semibold text-sm hover:brightness-110 transition-all accent-glow whitespace-nowrap"
        >
          Get started <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  );
}
