import { ScoreTier, Row } from "@/store/lifecycleStore";
import { ArrowRight } from "lucide-react";
import { PhaseKey } from "@/pages/LifecycleBreakdown";
import { formatCO2eValue } from "@/lib/utils";

interface ImpactCardProps {
  material: Row;
  onClick: () => void;
  currentMetric: number;
  currentUnit: string;
  phases: { phase: PhaseKey; value: number; color: string; isActive?: boolean }[];
}

export function ImpactCard({ 
  material, 
  onClick, 
  currentMetric, 
  currentUnit,
  phases 
}: ImpactCardProps) {
  const maxValue = Math.max(...phases.map(p => p.value));
  
  // Get material category and region
  const category = material.name.includes('Wall') ? 'Wood' : 
                   material.name.includes('Hempcrete') ? 'Bio-based' : 
                   material.name.includes('Rammed') ? 'Earth' : 'Mineral';
  const region = 'PNW';

  // Format large values properly
  const formatted = formatCO2eValue(currentMetric, currentUnit);

  return (
    <button 
      onClick={onClick}
      className="group w-full rounded-lg shadow-sm border transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] p-3 text-left"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'var(--ring-lifecycle)',
        minHeight: '120px',
      }}
    >
      {/* Header: Material name + category/region */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate mb-0.5" style={{ color: 'var(--text)' }}>
            {material.name}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {category} · {region}
          </p>
        </div>
        <ArrowRight 
          className="h-3.5 w-3.5 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" 
          style={{ color: 'var(--text-sub)' }} 
        />
      </div>

      {/* Key Metric */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold" style={{ color: 'var(--phase-prod)' }}>
            {formatted.value}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {formatted.unit}
          </span>
        </div>
      </div>

      {/* Mini horizontal bar preview */}
      <div className="space-y-1">
        <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>
          Lifecycle phases
        </p>
        <div className="flex h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.08)' }}>
          {phases.map((phase, idx) => {
            const widthPercent = maxValue > 0 ? (phase.value / phases.reduce((sum, p) => sum + p.value, 0)) * 100 : 0;
            const isActive = phase.isActive !== false;
            return (
              <div
                key={idx}
                style={{
                  width: `${widthPercent}%`,
                  background: phase.color,
                  opacity: isActive ? 1 : 0.3,
                }}
                className="h-full transition-all"
              />
            );
          })}
        </div>
      </div>

      {/* Subtle "Details" CTA */}
      <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--ring-lifecycle)' }}>
        <span className="text-xs font-medium transition-all group-hover:translate-x-0.5 inline-flex items-center gap-1" style={{ color: 'var(--phase-prod)' }}>
          Details →
        </span>
      </div>
    </button>
  );
}
