import { ScoreTier } from "@/store/lifecycleStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ImpactCardProps {
  lis: number;
  ris: number;
  risTier: ScoreTier;
  cpi: number;
  materialName: string;
}

const tierColors: Record<ScoreTier, string> = {
  Gold: "#d4af37",
  Silver: "#c0c0c0",
  Bronze: "#cd7f32",
  Problematic: "#e74c3c",
};

const tierLabels: Record<ScoreTier, string> = {
  Gold: "High Performance",
  Silver: "Resilient",
  Bronze: "Adequate",
  Problematic: "Needs Improvement",
};

export function ImpactCard({ lis, ris, risTier, cpi, materialName }: ImpactCardProps) {
  return (
    <div 
      className="rounded-xl shadow ring-1 px-4 py-3 space-y-2"
      style={{
        background: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-sub)' }}>
          {materialName}
        </span>
      </div>
      
      <div className="space-y-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between cursor-help">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                    RIS
                  </span>
                  <Info className="h-3 w-3" style={{ color: 'var(--text-sub)' }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: tierColors[risTier] }}>
                    {ris}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    background: tierColors[risTier] + '20',
                    color: tierColors[risTier],
                    fontWeight: 600,
                  }}>
                    {tierLabels[risTier]}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Regenerative Impact Score: Weighted score for carbon + durability + circularity
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between cursor-help">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                    LIS
                  </span>
                  <Info className="h-3 w-3" style={{ color: 'var(--text-sub)' }} />
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  {lis}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Lifecycle Impact Score: Overall environmental performance across all phases
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
            CPI
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--phase-prod)' }}>
            ${cpi.toFixed(2)}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
          per kg CO₂e saved
        </p>
      </div>
    </div>
  );
}
