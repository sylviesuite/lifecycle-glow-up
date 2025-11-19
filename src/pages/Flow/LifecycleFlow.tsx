import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Step1Filters } from "./Step1Filters";
import { Step2Materials } from "./Step2Materials";
import { Step3Breakdown } from "./Step3Breakdown";
import { Step4Insights } from "./Step4Insights";
import FloatingParticles from "@/components/FloatingParticles";

export function LifecycleFlow() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#0B0F16' }}>
      {/* GMUNK Glowing Background with Parallax */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #09FBD3 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #FF8E4A 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #8378FF 0%, transparent 70%)',
            transform: `translate(calc(-50% + ${mousePosition.x * 10}px), calc(-50% + ${mousePosition.y * 10}px))`
          }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Architectural Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04] -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='rgba(9, 251, 211, 0.15)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Header Actions - Fixed position */}
      <div className="fixed top-3 left-4 right-4 flex items-center justify-between z-50">
        <Button
          onClick={handleBackToHome}
          className="shadow-lg px-3 py-1.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          aria-label="Back to home"
          style={{
            background: 'var(--phase-prod)',
            color: 'white',
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Home
        </Button>
        
        <Button
          size="icon"
          onClick={toggleTheme}
          className="shrink-0 shadow-lg hover:opacity-90 transition-opacity h-9 w-9"
          aria-label="Toggle theme"
          style={{
            background: 'var(--phase-prod)',
            color: 'white',
          }}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Step Indicator - Glowing Capsules */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full grid place-items-center text-sm font-bold transition-all ${
                s === step ? 'shadow-[0_0_20px_rgba(9,251,211,0.6)]' : ''
              }`}
              style={{
                background: s === step 
                  ? 'linear-gradient(135deg, #09FBD3 0%, #FF8E4A 100%)' 
                  : 'rgba(15, 23, 42, 0.6)',
                border: s === step ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: s === step ? 'none' : 'blur(10px)',
                color: s === step ? '#0B0F16' : 'rgba(249, 250, 251, 0.5)',
              }}
              aria-current={s === step ? 'step' : undefined}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Step1Filters onNext={handleNext} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Step2Materials onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Step3Breakdown onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Step4Insights onBack={handleBack} onFinish={handleFinish} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
