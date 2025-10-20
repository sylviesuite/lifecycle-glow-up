import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { X } from "lucide-react";

type ComponentData = {
  name: string;
  share: number;
  phase: string;
};

type CompositionData = {
  [key: string]: ComponentData[];
};

const compositionData: CompositionData = {
  "Rammed Earth": [
    { name: "Earth/Clay", share: 0.6, phase: "Production" },
    { name: "Stabilizer", share: 0.25, phase: "Production" },
    { name: "Finish", share: 0.15, phase: "Maintenance" },
  ],
  "2x6 Wall": [
    { name: "Studs", share: 0.4, phase: "Production" },
    { name: "Insulation", share: 0.3, phase: "Maintenance" },
    { name: "Siding", share: 0.3, phase: "End of Life" },
  ],
  "Hempcrete (6\" infill)": [
    { name: "Hemp Shiv", share: 0.5, phase: "Production" },
    { name: "Lime Binder", share: 0.35, phase: "Production" },
    { name: "Water", share: 0.15, phase: "Construction" },
  ],
  "Drywall 4x8 (1/2\")": [
    { name: "Gypsum Core", share: 0.7, phase: "Production" },
    { name: "Paper Facing", share: 0.2, phase: "Production" },
    { name: "Adhesives", share: 0.1, phase: "Construction" },
  ],
};

const phaseColors: { [key: string]: string } = {
  "Production": "var(--phase-prod)",
  "Transport": "var(--phase-trans)",
  "Construction": "var(--phase-cons)",
  "Maintenance": "var(--phase-main)",
  "End of Life": "var(--phase-eol)",
};

interface MaterialCompositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assemblyName: string;
}

export function MaterialCompositionModal({ 
  open, 
  onOpenChange, 
  assemblyName 
}: MaterialCompositionModalProps) {
  const components = compositionData[assemblyName] || [];
  
  const chartData = components.map(c => ({
    name: c.name,
    value: c.share * 100,
    fill: phaseColors[c.phase] || "var(--phase-prod)"
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[600px] overflow-hidden rounded-2xl backdrop-blur-md shadow-xl p-0"
        style={{
          background: 'var(--canvas)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            {assemblyName} — Material Composition
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[500px]">
          {/* Component Breakdown Table */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Component Breakdown
            </h3>
            <div className="space-y-2">
              {components.map((component, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderColor: 'var(--ring-lifecycle)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ background: phaseColors[component.phase] }}
                    />
                    <span className="font-medium" style={{ color: 'var(--text)' }}>
                      {component.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
                      {component.phase}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>
                      {(component.share * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Bar Chart */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Phase Distribution
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={100} style={{ fontSize: '12px' }} />
                <Bar dataKey="value" radius={4}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Source Footnote */}
          <div 
            className="p-4 rounded-lg text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderLeft: `3px solid var(--phase-prod)`,
            }}
          >
            <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>
              Data Source
            </p>
            <p style={{ color: 'var(--text-sub)' }}>
              EPD #4123 (2024, Ecoinvent v3.8) — Industry average for North American production
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{ color: 'var(--text)' }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
