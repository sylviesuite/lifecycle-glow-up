import { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { lifecycleStore } from "@/store/lifecycleStore";
import { PhaseKey, phaseConfig } from "@/pages/LifecycleBreakdown";

interface Step3BreakdownProps {
  onNext: () => void;
  onBack: () => void;
}

const phases: PhaseKey[] = [
  "Point of Origin → Production",
  "Transport",
  "Construction",
  "Maintenance",
  "End of Life",
];

export function Step3Breakdown({ onNext, onBack }: Step3BreakdownProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const rows = lifecycleStore.getFilteredRows();
  const units = lifecycleStore.getState().units;

  const handleBarMouseEnter = (material: string, phase: PhaseKey) => {
    setActiveMaterial(material);
    setActivePhase(phase);
  };

  const handleBarMouseLeave = () => {
    setActivePhase(null);
    setActiveMaterial(null);
  };

  const activeRow = rows.find(r => r.name === activeMaterial);

  return (
    <div className="flex flex-col min-h-screen p-6 overflow-hidden">
      <div 
        ref={cardRef}
        className="h-[calc(100vh-3rem)] rounded-2xl backdrop-blur-sm shadow-md p-8 flex flex-col"
        style={{ 
          background: 'var(--canvas)', 
          border: '1px solid var(--ring-lifecycle)'
        }}
      >
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
            Lifecycle Breakdown
          </h2>
          <p className="text-base" style={{ color: 'var(--text-sub)' }}>
            Horizontal stacked bars by lifecycle phase. Units: {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per m²
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {phases.map((phase) => (
            <div
              key={phase}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: activePhase === phase ? 'white' : 'var(--legend-pill)',
                border: `1px solid ${activePhase === phase ? phaseConfig[phase].fill : 'rgba(0,0,0,0.05)'}`,
                opacity: activePhase === phase ? 1 : 0.7,
                fontWeight: activePhase === phase ? 600 : 400,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: phaseConfig[phase].fill }}
              />
              <span className="text-sm" style={{ color: 'var(--text)' }}>
                {phaseConfig[phase].shortLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 180, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" />
              <XAxis type="number" stroke="var(--text-sub)" />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                stroke="var(--text)"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
              {phases.map((phase) => (
                <Bar
                  key={phase}
                  dataKey={phase}
                  stackId="lc"
                  fill={phaseConfig[phase].fill}
                  onMouseEnter={(data) => handleBarMouseEnter(data.name, phase)}
                  onMouseLeave={handleBarMouseLeave}
                >
                  {rows.map((row) => (
                    <Cell
                      key={`cell-${row.name}-${phase}`}
                      opacity={activeMaterial === row.name && activePhase === phase ? 1 : 0.9}
                      stroke={activeMaterial === row.name && activePhase === phase ? 'var(--hover-stroke)' : 'none'}
                      strokeWidth={activeMaterial === row.name && activePhase === phase ? 1.5 : 0}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Anchored info panel */}
        {activeRow && activePhase && (
          <div 
            className="mt-4 p-4 rounded-xl border animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'var(--ring-lifecycle)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded"
                style={{ background: phaseConfig[activePhase].fill }}
              />
              <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                {activeMaterial} — {phaseConfig[activePhase].label}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--text-sub)' }}>Phase Impact:</span>
                <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                  {activeRow[activePhase].toFixed(1)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-sub)' }}>Total Impact:</span>
                <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                  {activeRow.total?.toFixed(1)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-base font-medium shadow-sm"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
          >
            Next: Insights & Export
          </Button>
        </div>
      </div>
    </div>
  );
}
