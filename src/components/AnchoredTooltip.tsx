import { useEffect, useRef, useState } from "react";
import { phaseConfig, PhaseKey } from "@/pages/LifecycleBreakdown";
import { Info } from "lucide-react";

interface AnchoredTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x?: number; y?: number };
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  activePhase: PhaseKey | null;
  onPhaseClick: (phase: PhaseKey) => void;
  units: "kgCO2e" | "MJ";
  rowTotal: number;
  sumSelected: number;
  measure?: "Impact" | "Cost";
  costData?: {
    capex: number;
    tco: number;
    mac: number | null;
    payback: number | null;
    years: number;
    discountRate: number;
  };
}

export const AnchoredTooltip = ({
  active,
  payload,
  label,
  coordinate,
  viewBox,
  activePhase,
  onPhaseClick,
  units,
  rowTotal,
  sumSelected,
  measure = "Impact",
  costData,
}: AnchoredTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number; flipAbove: boolean } | null>(null);

  useEffect(() => {
    if (!tooltipRef.current || !coordinate || !viewBox) return;

    const tooltipEl = tooltipRef.current;
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const containerWidth = viewBox.width || 0;
    const containerHeight = viewBox.height || 0;

    const anchorX = coordinate.x || 0;
    const anchorY = coordinate.y || 0;

    // Center horizontally under the anchor, clamped to container edges with padding
    const horizontalPadding = 16;
    let left = anchorX - tooltipRect.width / 2;
    left = Math.max(horizontalPadding, Math.min(left, containerWidth - tooltipRect.width - horizontalPadding));

    // Position below the anchor by default with a small gap
    const verticalGap = 12;
    let top = anchorY + verticalGap;
    let flipAbove = false;

    // If not enough space below, flip above
    if (top + tooltipRect.height > containerHeight - 20) {
      top = anchorY - tooltipRect.height - verticalGap;
      flipAbove = true;
    }

    setPosition({ left, top, flipAbove });
  }, [coordinate, viewBox]);

  if (!active || !payload || !position) return null;

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  const activePhaseValue = activePhase && payload
    ? payload.find((p) => p.dataKey === activePhase)?.value || 0
    : 0;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
        pointerEvents: "none",
        zIndex: 50,
        opacity: 0,
        animation: "fadeSlideIn 150ms ease-out forwards",
      }}
      className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-black/5 p-3 text-sm min-w-[280px] max-w-[320px]"
      role="note"
      aria-live="polite"
    >
      <p className="font-semibold text-sm text-slate-900 mb-2.5">{label}</p>
      
      {measure === "Impact" ? (
        <div className="space-y-1">
          {payload?.map((entry: any) => {
            const key = entry.dataKey as PhaseKey;
            const phase = phaseConfig[key];
            if (!phase) return null;

            return (
              <div
                key={key}
                onClick={() => onPhaseClick(key)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded transition-all pointer-events-auto cursor-pointer ${
                  activePhase === key
                    ? "bg-black/5 font-bold scale-[1.02]"
                    : "hover:bg-black/5 opacity-80"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-sm flex-shrink-0 ${phase.colorClass} bg-current`}
                />
                <span className="text-xs text-slate-600 flex-1 text-left">
                  {phase.label}:
                </span>
                <span className="text-xs font-medium text-slate-900 whitespace-nowrap">
                  {formatNumber(entry.value)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        costData && (
          <div className="space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Initial Cost:</span>
                <span className="font-medium text-slate-900">${formatNumber(costData.capex)}/m²</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">TCO ({costData.years}y @ {costData.discountRate}%):</span>
                <span className="font-medium text-slate-900">${formatNumber(costData.tco)}/m²</span>
              </div>
              {costData.mac !== null && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">MAC vs Baseline:</span>
                  <span className={`font-medium ${costData.mac <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    ${formatNumber(costData.mac)}/tCO₂e
                  </span>
                </div>
              )}
              {costData.payback !== null && costData.payback > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Payback:</span>
                  <span className="font-medium text-slate-900">{costData.payback.toFixed(1)} years</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-black/10 pt-2 mt-2">
              <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-black/5 p-2 rounded">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">Cost Formulas:</div>
                  <div>TCO = CAPEX + Σ(Operating Costs × Discount Factor) - Salvage Value</div>
                  <div className="mt-1">MAC = (Cost - Baseline Cost) / (Baseline CO₂e - Material CO₂e)</div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {measure === "Impact" && activePhase && activePhaseValue > 0 && (
        <div className="mt-3 border-t border-black/10 pt-3 space-y-2">
          <div className="text-[13px] text-slate-700">
            <div>
              <span className="font-medium">This phase:</span> {formatNumber(activePhaseValue)}{" "}
              {units === "kgCO2e" ? "kg CO₂e" : "MJ"} • {formatPercent(activePhaseValue / rowTotal)} of this
              material
            </div>
            <div className="mt-1">
              <span className="font-medium">This material:</span> {formatPercent(rowTotal / sumSelected)} of
              total across selected
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-black/10">
            <div
              className="h-full bg-current/60"
              style={{ width: `${Math.min(100, (activePhaseValue / rowTotal) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {measure === "Impact" && (
        <p className="text-[10px] text-slate-500 mt-2.5 text-center italic">
          Click any phase for detailed breakdown
        </p>
      )}
    </div>
  );
};
