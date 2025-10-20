import { useEffect, useRef, useState } from "react";
import { phaseConfig, PhaseKey } from "@/pages/LifecycleBreakdown";

interface AnchoredTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x?: number; y?: number };
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  activePhase: PhaseKey | null;
  onPhaseClick: (phase: PhaseKey) => void;
  units: "kgCO2e" | "MJ";
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

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
        pointerEvents: "auto",
        zIndex: 50,
        opacity: 0,
        animation: "fadeSlideIn 150ms ease-out forwards",
      }}
      className="bg-card border border-border rounded-lg shadow-xl p-3 min-w-[280px] max-w-[320px]"
    >
      <p className="font-semibold text-sm text-foreground mb-2.5">{label}</p>
      <div className="space-y-1">
        {payload?.map((entry: any) => {
          const key = entry.dataKey as PhaseKey;
          const phase = phaseConfig[key];
          if (!phase) return null;

          return (
            <button
              key={key}
              onClick={() => onPhaseClick(key)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all ${
                activePhase === key
                  ? "bg-accent/20 font-bold scale-[1.02]"
                  : "hover:bg-accent/10 opacity-70"
              }`}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground flex-1 text-left">
                {phase.label}:
              </span>
              <span className="text-xs font-medium whitespace-nowrap">
                {formatNumber(entry.value)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2.5 text-center italic">
        Click any phase for detailed breakdown
      </p>
    </div>
  );
};
