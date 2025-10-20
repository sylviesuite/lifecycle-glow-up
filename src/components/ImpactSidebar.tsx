import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhaseKey, phaseConfig } from "@/pages/LifecycleBreakdown";
import { Row } from "@/store/lifecycleStore";
import { ScoreBadge } from "@/components/ui/score-badge";
import { useEffect } from "react";

interface ImpactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  material: Row | null;
  phase: PhaseKey | null;
  impactData: number[];
  currentUnit: string;
  activePhases?: Set<PhaseKey>;
}

const phases: PhaseKey[] = [
  "Point of Origin → Production",
  "Transport",
  "Construction",
  "Maintenance",
  "End of Life",
];

export function ImpactSidebar({
  isOpen,
  onClose,
  material,
  phase,
  impactData,
  currentUnit,
  activePhases = new Set(),
}: ImpactSidebarProps) {
  if (!material || !phase) return null;

  const totalImpact = impactData.reduce((sum, val) => sum + val, 0);
  const phaseIndex = phases.indexOf(phase);
  const phaseValue = impactData[phaseIndex];
  const phaseColor = phaseConfig[phase].fill;
  const phaseLabel = phaseConfig[phase].shortLabel;

  // ESC key to close drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 h-[60vh] z-50 shadow-2xl overflow-y-auto rounded-t-2xl"
            style={{
              background: 'var(--canvas)',
              borderTop: '2px solid var(--ring-lifecycle)',
            }}
          >
            {/* Header */}
            <div 
              className="sticky top-0 p-4 border-b flex items-center justify-between backdrop-blur-sm z-10"
              style={{
                background: 'var(--canvas)',
                borderColor: 'var(--ring-lifecycle)',
              }}
            >
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                Material Detail
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-black/5"
                style={{ color: 'var(--text)' }}
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Material Header & Full Lifecycle Bar */}
              <section className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                      {material.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                      Total: {totalImpact.toFixed(1)} {currentUnit}
                    </p>
                  </div>
                </div>

                {/* Full Stacked Horizontal Bar */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-sub)' }}>
                    LIFECYCLE PHASES
                  </p>
                  <div className="flex h-8 rounded-lg overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                    {phases.map((ph, idx) => {
                      const value = impactData[idx];
                      const widthPercent = totalImpact > 0 ? (value / totalImpact) * 100 : 0;
                      const isActive = activePhases.size === 0 || activePhases.has(ph);
                      
                      return (
                        <div
                          key={ph}
                          style={{
                            width: `${widthPercent}%`,
                            background: phaseConfig[ph].fill,
                            opacity: isActive ? 1 : 0.3,
                          }}
                          className="h-full transition-all"
                          title={`${phaseConfig[ph].shortLabel}: ${value.toFixed(1)} ${currentUnit}`}
                        />
                      );
                    })}
                  </div>

                  {/* Interactive Legend */}
                  <div className="flex flex-wrap gap-2">
                    {phases.map((ph, idx) => {
                      const value = impactData[idx];
                      const percent = totalImpact > 0 ? (value / totalImpact) * 100 : 0;
                      const isActive = activePhases.size === 0 || activePhases.has(ph);
                      
                      return (
                        <div
                          key={ph}
                          className="flex items-center gap-2 px-2 py-1 rounded text-xs transition-all"
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.05)',
                            border: `1px solid ${phaseConfig[ph].fill}`,
                            opacity: isActive ? 1 : 0.5,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-sm"
                            style={{ background: phaseConfig[ph].fill }}
                          />
                          <span className="font-medium" style={{ color: 'var(--text)' }}>
                            {phaseConfig[ph].shortLabel}
                          </span>
                          <span style={{ color: 'var(--text-sub)' }}>
                            {value.toFixed(0)} ({percent.toFixed(0)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Grid Layout for Data Source & Impact Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Source */}
                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-sub)' }}>
                    Data Source
                  </h3>
                  <div 
                    className="p-4 rounded-lg border-l-4 space-y-2"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderColor: phaseColor,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                          EPD #4123 (2024)
                        </p>
                        <p className="text-sm mb-0.5" style={{ color: 'var(--text-sub)' }}>
                          Ecoinvent v3.8 database
                        </p>
                        <p className="text-sm mb-0.5" style={{ color: 'var(--text-sub)' }}>
                          North America
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                          ISO 14025 compliant
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>
                      METHODOLOGY NOTES
                    </p>
                    <ul className="space-y-1 text-xs" style={{ color: 'var(--text-sub)' }}>
                      <li>• Industry average for {material.name.toLowerCase()}</li>
                      <li>• Includes upstream emissions</li>
                      <li>• Transport: 300 km average</li>
                      <li>• {material.lifespanYears}-year lifespan</li>
                    </ul>
                  </div>
                </section>

                {/* Impact Scores */}
                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-sub)' }}>
                    Impact Scores
                  </h3>
                  <div className="space-y-3">
                    <ScoreBadge
                      label="RIS"
                      value={material.ris}
                      maxValue={100}
                      description="Regenerative potential & circularity"
                    />
                    <ScoreBadge
                      label="LIS"
                      value={material.lis}
                      maxValue={100}
                      description="Lifecycle environmental performance"
                    />
                    <ScoreBadge
                      label="CPI"
                      value={material.cpi}
                      maxValue={10}
                      unit="$ / kg CO₂e"
                      description="Cost efficiency vs. baseline"
                    />
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
