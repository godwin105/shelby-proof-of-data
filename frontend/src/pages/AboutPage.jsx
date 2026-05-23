import {
  Cpu,
  Database,
  FileCheck,
  Fingerprint,
  Link2,
  Lock,
  Scale,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Tamper-proof record",
    desc: "A SHA-256 hash changes completely if a file is edited.",
  },
  {
    icon: Database,
    title: "Shelby storage",
    desc: "Files are stored as blobs on Shelby's decentralized hot-storage network.",
  },
  {
    icon: Link2,
    title: "Aptos anchor",
    desc: "The proof is tied to an on-chain transaction and timestamp.",
  },
  {
    icon: FileCheck,
    title: "Public verification",
    desc: "Anyone can check a proof later using the file or its hash.",
  },
];

const USE_CASES = [
  { icon: Shield, label: "Copyright protection", desc: "Images, videos, music, and drafts" },
  { icon: Fingerprint, label: "Research priority", desc: "Ideas, studies, notes, and reports" },
  { icon: Scale, label: "Legal evidence", desc: "Contracts, signatures, and records" },
  { icon: Database, label: "Dataset integrity", desc: "Training data and source material" },
];

export default function AboutPage() {
  return (
    <div className="page-shell py-10 sm:py-14 lg:py-16">
      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8 items-start mb-10">
        <div className="min-w-0">
          <p className="section-kicker mb-3">How it works</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-shelby-text leading-tight">
            File proof with storage and blockchain finality.
          </h1>
          <p className="text-sm sm:text-base text-shelby-muted max-w-2xl leading-relaxed mt-4">
            Shelby Proof-of-Data combines browser hashing, Shelby blob storage,
            and Aptos transactions into a verifiable proof record.
          </p>
        </div>

        <div className="panel p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: "01", label: "Hash", sub: "SHA-256 in browser" },
              { step: "02", label: "Store", sub: "Shelby blob upload" },
              { step: "03", label: "Anchor", sub: "Aptos transaction" },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-shelby-border bg-shelby-bg/55 p-4">
                <p className="font-mono font-bold text-xl text-shelby-accent">{item.step}</p>
                <p className="font-display font-semibold text-shelby-text text-sm mt-2">{item.label}</p>
                <p className="text-xs text-shelby-muted mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 className="font-display text-2xl font-semibold text-shelby-text">Core benefits</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="panel p-5">
              <div className="w-10 h-10 rounded-xl bg-shelby-accent/10 border border-shelby-accent/25 flex items-center justify-center mb-4">
                <Icon size={18} className="text-shelby-accent" />
              </div>
              <p className="font-display font-semibold text-shelby-text text-base">{title}</p>
              <p className="text-sm text-shelby-muted leading-relaxed mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_22rem] gap-6 lg:gap-8 items-start">
        <div>
          <h2 className="font-display text-2xl font-semibold text-shelby-text mb-5">Use cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="panel p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-shelby-accent/10 border border-shelby-accent/25 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-shelby-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-shelby-text text-sm">{label}</p>
                  <p className="text-xs text-shelby-muted leading-relaxed mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-shelby-accent" />
            <span className="font-display font-bold text-shelby-text text-sm">Tech stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["React + Vite", "FastAPI", "MySQL", "Shelby Storage", "Aptos Move", "SHA-256"].map((item) => (
              <span
                key={item}
                className="text-xs font-mono px-2.5 py-1.5 rounded-full bg-shelby-bg border border-shelby-border text-shelby-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
