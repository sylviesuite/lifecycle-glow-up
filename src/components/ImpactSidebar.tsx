import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhaseKey } from "@/pages/LifecycleBreakdown";
import { Row } from "@/store/lifecycleStore";

interface ImpactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  material: Row | null;
  phase: PhaseKey | null;
  phaseValue: number;
  phaseColor: string;
  phaseLabel: string;
}

export function ImpactSidebar({
  isOpen,
  onClose,
  material,
  phase,
  phaseValue,
  phaseColor,
  phaseLabel,
}: ImpactSidebarProps) {
  if (!material || !phase) return null;

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

          {/* Bottom Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[60vh] max-h-[600px] z-50 shadow-2xl overflow-y-auto"
            style={{
              background: 'var(--canvas)',
              borderTop: '2px solid var(--ring-lifecycle)',
            }}
          >
            {/* Header */}
            <div 
              className="sticky top-0 p-6 border-b flex items-center justify-between"
              style={{
                background: 'var(--canvas)',
                borderColor: 'var(--ring-lifecycle)',
              }}
            >
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <button
                onClick={onClose}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
                style={{ color: 'var(--text)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Material & Phase Impact */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    {material.name}
                  </h2>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: phaseColor + '20' }}
                  >
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ background: phaseColor }}
                    />
                    <span className="font-semibold" style={{ color: phaseColor }}>
                      {phaseLabel}
                    </span>
                  </div>
                </div>

                {/* Phase Impact */}
                <div 
                  className="p-4 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-sub)' }}>
                    Phase Impact
                  </p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                    {phaseValue.toFixed(1)} kg CO₂e
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
                    {((phaseValue / (material.total || 1)) * 100).toFixed(1)}% of total lifecycle
                  </p>
                </div>
              </div>

              {/* Column 2: Data Source & Phase Notes */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    Data Source
                  </h3>
                  <div 
                    className="p-4 rounded-lg border-l-4"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderColor: phaseColor,
                    }}
                  >
                    <p className="font-medium mb-2" style={{ color: 'var(--text)' }}>
                      EPD #4123 (2024)
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                      Source: Ecoinvent v3.8 database
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                      Region: North America
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                      Verified: ISO 14025 compliant
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    Phase Notes
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: 'var(--text-sub)' }}>
                    <p>
                      • Industry average data for {material.name.toLowerCase()}
                    </p>
                    <p>
                      • Includes upstream emissions and material extraction
                    </p>
                    <p>
                      • Transportation assumed at 300 km average distance
                    </p>
                    <p>
                      • Maintenance schedule based on {material.lifespanYears}-year lifespan
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 3: Impact Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
                  Impact Scores
                </h3>
                <div className="space-y-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        RIS (Regenerative Impact)
                      </span>
                      <span className="text-lg font-bold" style={{ color: 'var(--phase-prod)' }}>
                        {material.ris}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      Measures carbon sequestration potential, durability, and end-of-life circularity
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        LIS (Lifecycle Impact)
                      </span>
                      <span className="text-lg font-bold" style={{ color: 'var(--phase-prod)' }}>
                        {material.lis}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      Comprehensive environmental performance across all lifecycle phases
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>
                        CPI (Cost per Impact)
                      </span>
                      <span className="text-lg font-bold" style={{ color: 'var(--phase-prod)' }}>
                        ${material.cpi.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      Economic efficiency: dollars per kg CO₂e saved vs. baseline
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
