import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step1Filters } from "./Step1Filters";
import { Step2Materials } from "./Step2Materials";
import { Step3Breakdown } from "./Step3Breakdown";
import { Step4Insights } from "./Step4Insights";

export function LifecycleFlow() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem('bp-theme') as "light" | "dark" | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bp-theme', next);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    // Navigate back or reset
    window.history.back();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient Background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div 
          className="absolute inset-0" 
          style={{ background: 'linear-gradient(180deg, var(--bg-from), var(--bg-via), var(--bg-to))' }}
        />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect fill=%22%23000000%22 fill-opacity=%220.04%22 width=%2240%22 height=%2240%22/></svg>')]" />
      </div>

      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0 shadow-lg"
          aria-label="Toggle theme"
          style={{
            background: 'var(--canvas)',
            borderColor: 'var(--ring-lifecycle)',
          }}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
          style={{
            background: 'var(--canvas)',
            border: '1px solid var(--ring-lifecycle)',
          }}
        >
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="flex items-center gap-2"
            >
              <div
                className={`w-8 h-8 rounded-full grid place-items-center text-xs font-semibold transition-all ${
                  s === step ? 'shadow-md' : ''
                }`}
                style={{
                  background: s === step ? 'var(--phase-prod)' : s < step ? 'var(--phase-trans)' : 'var(--legend-pill)',
                  color: s <= step ? 'white' : 'var(--text-sub)',
                }}
                aria-current={s === step ? 'step' : undefined}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className="w-8 h-0.5"
                  style={{
                    background: s < step ? 'var(--phase-trans)' : 'var(--ring-lifecycle)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full h-screen overflow-hidden">
        {step === 1 && <Step1Filters onNext={handleNext} />}
        {step === 2 && <Step2Materials onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Step3Breakdown onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <Step4Insights onBack={handleBack} onFinish={handleFinish} />}
      </div>
    </div>
  );
}
