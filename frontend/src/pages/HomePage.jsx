import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  Fingerprint,
  Scale,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Fingerprint,
    title: "SHA-256 fingerprint",
    desc: "The file hash is created locally before the proof is saved.",
  },
  {
    icon: Database,
    title: "Shelby hot storage",
    desc: "Upload the file as a blob on Shelby's decentralized storage network.",
  },
  {
    icon: Clock3,
    title: "Aptos timestamp",
    desc: "Anchor the proof on Aptos for a public, immutable timestamp.",
  },
  {
    icon: FileCheck2,
    title: "Fast verification",
    desc: "Verify later with either the original file or the known hash.",
  },
];

const USE_CASES = [
  { icon: Shield, label: "Copyright" },
  { icon: Scale, label: "Legal evidence" },
  { icon: FileCheck2, label: "Research records" },
  { icon: Database, label: "Dataset integrity" },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <section className="page-shell pt-3 sm:pt-4 lg:pt-5 pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center">
          <div className="min-w-0">
            <p className="section-kicker mb-5">Shelby Proof-of-Data</p>
            <h1 className="font-display font-semibold leading-[0.9] text-shelby-text text-5xl sm:text-7xl lg:text-8xl max-w-4xl">
              Prove your file existed <em className="text-shelby-accent italic">forever.</em>
            </h1>
            <p className="text-base sm:text-lg text-shelby-muted max-w-2xl leading-relaxed mt-6">
              Generate a local SHA-256 fingerprint, store the file on Shelby, and
              anchor the proof on Aptos from one clean workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md sm:max-w-none">
              <Link
                to="/prove"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-shelby-accent text-shelby-onAccent font-semibold text-sm hover:brightness-110 transition-all accent-glow"
              >
                Prove a File <ArrowRight size={16} />
              </Link>
              <Link
                to="/verify"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-shelby-border bg-shelby-surface/70 text-shelby-text hover:border-shelby-accent/40 text-sm font-medium transition-all"
              >
                Verify Proof
              </Link>
            </div>
          </div>

          <div className="panel p-4 sm:p-5">
            <div className="rounded-2xl border border-shelby-border bg-shelby-bg/70 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-shelby-muted">Live proof flow</p>
                  <p className="font-display text-xl font-bold text-shelby-text mt-1">spicenet-demo.mp4</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-shelby-success/10 text-shelby-success border border-shelby-success/25">
                  <CheckCircle2 size={13} /> Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Hash", "0x78997a6f..."],
                  ["Storage", "Shelby blob"],
                  ["Network", "Aptos testnet"],
                  ["Status", "Verifiable"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-shelby-border bg-shelby-surface p-3 min-w-0">
                    <p className="text-[0.68rem] font-mono uppercase tracking-widest text-shelby-muted">{label}</p>
                    <p className="text-sm text-shelby-text font-semibold mt-1 truncate">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-shelby-border bg-shelby-surface p-3 space-y-3">
                {["Hash file", "Store on Shelby", "Anchor on Aptos", "Certificate ready"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-shelby-accent/10 border border-shelby-accent/25 text-shelby-accent grid place-items-center text-xs font-mono">
                      {index + 1}
                    </span>
                    <span className="text-sm text-shelby-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-shelby-border bg-shelby-surface/35">
        <div className="page-shell py-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {USE_CASES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-shelby-border bg-shelby-bg/40 px-4 py-3">
              <Icon size={17} className="text-shelby-accent shrink-0" />
              <span className="text-sm text-shelby-text font-medium truncate">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="section-kicker mb-3">Why it works</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-shelby-text">
              Built for proof, not file sharing.
            </h2>
          </div>
          <Link to="/about" className="text-sm text-shelby-accent hover:underline w-fit">
            Learn more
          </Link>
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
    </div>
  );
}
