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
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number; flipAbove: boolean } | null>(null);

  useEffect(() => {
    if (!active || !payload || !coordinate || !coordinate.x || !coordinate.y || !viewBox || !panelRef.current) {
      setPosition(null);
      return;
    }

    const panel = panelRef.current;
    const chartContainer = panel.closest('[role="region"]');
    if (!chartContainer) return;

    const containerRect = chartContainer.getBoundingClientRect();
    const panelWidth = 280;
    const panelHeight = panel.offsetHeight || 200;
    const gap = 10;

    // Calculate bar position
    const barY = coordinate.y;
    const barHeight = 28; // matches barSize
    const barBottom = barY + barHeight / 2;
    const barTop = barY - barHeight / 2;

    // Check if there's room below
    const spaceBelow = containerRect.height - (barBottom - containerRect.top);
    const flipAbove = spaceBelow < panelHeight + gap + 20;

    // Calculate horizontal position (centered under bar)
    const barCenterX = coordinate.x;
    let left = barCenterX - panelWidth / 2;
    
    // Clamp to container bounds with padding
    left = Math.max(16, Math.min(left, containerRect.width - panelWidth - 16));

    // Calculate vertical position
    const top = flipAbove ? barTop - panelHeight - gap : barBottom + gap;

    setPosition({ left, top, flipAbove });
  }, [active, payload, coordinate, viewBox]);

  if (!active || !payload || !position) return null;

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div
      ref={panelRef}
      className="absolute z-50 animate-fade-in"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        transformOrigin: position.flipAbove ? 'bottom center' : 'top center',
      }}
    >
      <div className="rounded-lg border bg-popover p-4 shadow-lg min-w-[280px]">
        <p className="font-semibold text-foreground mb-3 text-sm">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            const phaseKey = entry.dataKey as PhaseKey;
            const isActive = activePhase === phaseKey;
            const phase = phaseConfig[phaseKey];
            
            return (
              <button
                key={index}
                onClick={() => onPhaseClick(phaseKey)}
                className="w-full flex items-center gap-2 text-sm p-1.5 rounded hover:bg-accent/50 transition-colors cursor-pointer"
                style={{
                  opacity: activePhase && !isActive ? 0.5 : 1,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground flex-1 text-left truncate">
                  {phase?.label}:
                </span>
                <span className="font-medium text-foreground whitespace-nowrap">
                  {formatNumber(entry.value)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Click a phase for details
        </p>
      </div>
    </div>
  );
};
