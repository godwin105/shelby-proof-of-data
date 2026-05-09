import { Shield, Database, Link2, Lock, FileCheck, Cpu } from "lucide-react";

const FEATURES = [
  { icon: Lock, title: "Tamper-Proof Record", desc: "SHA-256 hashes are mathematically impossible to reverse. Once recorded, no one can alter the original proof." },
  { icon: Database, title: "Shelby Decentralized Storage", desc: "Files are stored as blobs on Shelby's decentralized network — no single point of failure." },
  { icon: Link2, title: "Aptos Blockchain Anchor", desc: "Every hash is recorded on the Aptos blockchain, providing an immutable public timestamp." },
  { icon: FileCheck, title: "Publicly Verifiable", desc: "Anyone can verify a proof using the original file or its hash string — no account required." },
];

const USE_CASES = [
  { icon: "🎨", label: "Copyright Protection", desc: "Images, videos, creative works" },
  { icon: "🔬", label: "Research Proof", desc: "Ideas and studies dated on creation" },
  { icon: "⚖️", label: "Legal Evidence", desc: "Contracts and signed documents" },
  { icon: "📰", label: "Journalism", desc: "Verify original source material" },
  { icon: "🤖", label: "AI Dataset Integrity", desc: "Prove authenticity of training data" },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-shelby-accent/10 border border-shelby-accent/20 items-center justify-center mx-auto">
          <Shield size={24} className="text-shelby-accent" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-shelby-text">
          How Shelby <span className="text-shelby-accent">PoD</span> Works
        </h1>
        <p className="text-shelby-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          A decentralized tool that lets anyone prove a file existed at a specific point in time — without trusting any central authority.
        </p>
      </div>

      {/* Pipeline */}
      <div className="glass rounded-2xl p-5 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-bold text-shelby-text mb-6 text-center">
          3-Step Proof Pipeline
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {[
            { step: "01", label: "Upload File", sub: "Hashed locally via SHA-256", color: "text-shelby-accent" },
            { step: "02", label: "Store on Shelby", sub: "Blob stored on decentralized network", color: "text-shelby-accent2" },
            { step: "03", label: "Anchor on Aptos", sub: "Hash + timestamp written on-chain", color: "text-purple-400" },
          ].map((item, i) => (
            <div key={i} className="flex-1 text-center p-4 rounded-xl bg-shelby-bg border border-shelby-border">
              <p className={`font-mono font-bold text-xl ${item.color}`}>{item.step}</p>
              <p className="font-display font-semibold text-shelby-text text-sm mt-1">{item.label}</p>
              <p className="text-xs text-shelby-muted mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-shelby-text mb-5">Key Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-xl p-4 sm:p-5 space-y-2 hover:border-shelby-accent/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-shelby-accent/10 border border-shelby-accent/20 flex items-center justify-center">
                <Icon size={16} className="text-shelby-accent" />
              </div>
              <p className="font-display font-semibold text-shelby-text text-sm">{title}</p>
              <p className="text-xs text-shelby-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-shelby-text mb-5">Use Cases</h2>
        <div className="space-y-2 sm:space-y-3">
          {USE_CASES.map(({ icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 glass rounded-xl px-4 sm:px-5 py-3 sm:py-4 hover:border-shelby-accent/20 transition-colors">
              <span className="text-xl sm:text-2xl">{icon}</span>
              <div>
                <p className="font-semibold text-shelby-text text-sm">{label}</p>
                <p className="text-xs text-shelby-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="glass rounded-2xl p-5 sm:p-6 space-y-3 border border-shelby-accent/10">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-shelby-accent" />
          <span className="font-display font-bold text-shelby-text text-sm">Tech Stack</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["React + Vite", "FastAPI", "MySQL", "Shelby Storage", "Aptos Move", "SHA-256"].map((t) => (
            <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-full bg-shelby-surface border border-shelby-border text-shelby-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
