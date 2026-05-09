const STEPS = [
  { id: 1, label: "Hash File" },
  { id: 2, label: "Upload to Shelby" },
  { id: 3, label: "Anchor on Aptos" },
  { id: 4, label: "Proof Ready" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all duration-300
                ${done ? "bg-shelby-success/20 border-shelby-success text-shelby-success"
                  : active ? "bg-shelby-accent/20 border-shelby-accent text-shelby-accent animate-pulse-slow"
                  : "bg-shelby-surface border-shelby-border text-shelby-muted"}`}
              >
                {done ? "✓" : step.id}
              </div>
              <span className={`text-xs font-mono whitespace-nowrap
                ${active ? "text-shelby-accent" : done ? "text-shelby-success" : "text-shelby-muted"}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-5 transition-all duration-500
                ${done ? "bg-shelby-success/50" : "bg-shelby-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
