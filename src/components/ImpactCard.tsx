import { ScoreTier, Row } from "@/store/lifecycleStore";
import { ArrowRight } from "lucide-react";
import { PhaseKey } from "@/pages/LifecycleBreakdown";

interface ImpactCardProps {
  material: Row;
  onClick: () => void;
  currentMetric: number;
  currentUnit: string;
  phases: { phase: PhaseKey; value: number; color: string }[];
}

export function ImpactCard({ 
  material, 
  onClick, 
  currentMetric, 
  currentUnit,
  phases 
}: ImpactCardProps) {
  const maxValue = Math.max(...phases.map(p => p.value));
  
  // Get material category and region (mock data for now)
  const category = material.name.includes('Wall') ? 'Wood' : 
                   material.name.includes('Hempcrete') ? 'Bio-based' : 
                   material.name.includes('Rammed') ? 'Earth' : 'Mineral';
  const region = 'PNW'; // Pacific Northwest placeholder

  return (
    <button 
      onClick={onClick}
      className="group w-full rounded-xl shadow-sm border transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] p-4 text-left"
      style={{
        background: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        minHeight: '140px',
        maxHeight: '160px',
      }}
    >
      {/* Header: Material name + category/region */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base truncate mb-1" style={{ color: 'var(--text)' }}>
            {material.name}
          </h3>
          <p className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>
            {category} · {region}
          </p>
        </div>
        <ArrowRight 
          className="h-4 w-4 shrink-0 ml-2 transition-transform group-hover:translate-x-1" 
          style={{ color: 'var(--text-sub)' }} 
        />
      </div>

      {/* Key Metric */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{ color: 'var(--phase-prod)' }}>
            {currentMetric.toFixed(1)}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>
            {currentUnit}
          </span>
        </div>
      </div>

      {/* Mini horizontal bar preview */}
      <div className="space-y-1">
        <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-sub)' }}>
          Lifecycle phases
        </p>
        <div className="flex h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
          {phases.map((phase, idx) => {
            const widthPercent = maxValue > 0 ? (phase.value / phases.reduce((sum, p) => sum + p.value, 0)) * 100 : 0;
            return (
              <div
                key={idx}
                style={{
                  width: `${widthPercent}%`,
                  background: phase.color,
                }}
                className="h-full"
              />
            );
          })}
        </div>
      </div>

      {/* Subtle "Details" CTA */}
      <div className="mt-3 pt-2 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
        <span className="text-xs font-medium group-hover:underline" style={{ color: 'var(--phase-prod)' }}>
          View full breakdown
        </span>
      </div>
    </button>
  );
}
