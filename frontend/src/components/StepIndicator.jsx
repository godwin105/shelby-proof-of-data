import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Hash" },
  { id: 2, label: "Store" },
  { id: 3, label: "Anchor" },
  { id: 4, label: "Ready" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="min-w-[28rem] sm:min-w-0 flex items-center">
        {STEPS.map((step, i) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all duration-300 ${
                    done
                      ? "bg-shelby-success/20 border-shelby-success text-shelby-success"
                      : active
                        ? "bg-shelby-accent/20 border-shelby-accent text-shelby-accent animate-pulse-slow"
                        : "bg-shelby-surface border-shelby-border text-shelby-muted"
                  }`}
                >
                  {done ? <Check size={15} /> : step.id}
                </div>
                <span
                  className={`text-xs font-mono whitespace-nowrap ${
                    active ? "text-shelby-accent" : done ? "text-shelby-success" : "text-shelby-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 mb-5 transition-all duration-500 ${
                    done ? "bg-shelby-success/50" : "bg-shelby-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
