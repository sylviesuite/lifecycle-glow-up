import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
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
import { lifecycleStore, ImpactCategory } from "@/store/lifecycleStore";
import { PhaseKey, phaseConfig } from "@/pages/LifecycleBreakdown";
import { ImpactCard } from "@/components/ImpactCard";
import { ImpactSidebar } from "@/components/ImpactSidebar";

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

const impactCategories: { value: ImpactCategory; label: string; unit: string }[] = [
  { value: "CO2e", label: "CO₂e (Climate)", unit: "kg CO₂e" },
  { value: "Water", label: "Water Use", unit: "m³ water eq" },
  { value: "Acidification", label: "Acidification", unit: "kg SO₂ eq" },
  { value: "Resource", label: "Resource Depletion", unit: "kg Sb eq" },
];

export function Step3Breakdown({ onNext, onBack }: Step3BreakdownProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const state = lifecycleStore.getState();
  const rows = lifecycleStore.getFilteredRows();
  
  const [impactCategory, setImpactCategory] = useState<ImpactCategory>(state.impactCategory);
  const [chartMode, setChartMode] = useState<"absolute" | "percentage">(state.chartMode);
  const [viewMode, setViewMode] = useState<"impact" | "cpi">(state.viewMode);

  // Transform data based on selected impact category and view mode
  const transformedRows = useMemo(() => {
    return rows.map(row => {
      const impactData = row.impacts[impactCategory];
      
      if (viewMode === "cpi") {
        // Calculate CPI values for each phase
        const total = impactData.reduce((sum, val) => sum + val, 0);
        const cpiValues = impactData.map(val => 
          total > 0 ? (row.costPerM2 * val) / total : 0
        );
        
        return {
          ...row,
          "Point of Origin → Production": cpiValues[0],
          Transport: cpiValues[1],
          Construction: cpiValues[2],
          Maintenance: cpiValues[3],
          "End of Life": cpiValues[4],
          total: row.costPerM2 / (total || 1),
        };
      }
      
      if (chartMode === "percentage") {
        const total = impactData.reduce((sum, val) => sum + val, 0);
        return {
          ...row,
          "Point of Origin → Production": total > 0 ? (impactData[0] / total) * 100 : 0,
          Transport: total > 0 ? (impactData[1] / total) * 100 : 0,
          Construction: total > 0 ? (impactData[2] / total) * 100 : 0,
          Maintenance: total > 0 ? (impactData[3] / total) * 100 : 0,
          "End of Life": total > 0 ? (impactData[4] / total) * 100 : 0,
          total: 100,
        };
      }
      
      // Absolute mode with selected impact category
      return {
        ...row,
        "Point of Origin → Production": impactData[0],
        Transport: impactData[1],
        Construction: impactData[2],
        Maintenance: impactData[3],
        "End of Life": impactData[4],
        total: impactData.reduce((sum, val) => sum + val, 0),
      };
    });
  }, [rows, impactCategory, chartMode, viewMode]);

  const handleBarMouseEnter = (material: string, phase: PhaseKey) => {
    setActiveMaterial(material);
    setActivePhase(phase);
  };

  const handleBarMouseLeave = () => {
    setActivePhase(null);
    setActiveMaterial(null);
  };

  const handleBarClick = (data: any, phase: PhaseKey, event?: any) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setSelectedMaterial(data.name);
    setSelectedPhase(phase);
    setSidebarOpen(true);
  };

  const activeRow = transformedRows.find(r => r.name === activeMaterial);
  const originalRow = rows.find(r => r.name === activeMaterial);
  const sidebarRow = rows.find(r => r.name === selectedMaterial);

  const getCurrentUnit = () => {
    if (viewMode === "cpi") return "$ / kg CO₂e";
    if (chartMode === "percentage") return "% of total";
    return impactCategories.find(c => c.value === impactCategory)?.unit || "kg CO₂e";
  };

  const currentCategory = impactCategories.find(c => c.value === impactCategory);

  return (
    <>
      <div className="flex flex-col min-h-screen p-6 overflow-hidden">
        <div 
          ref={cardRef}
          className="h-[calc(100vh-3rem)] rounded-2xl backdrop-blur-sm shadow-md p-8 flex flex-col"
          style={{ 
            background: 'var(--canvas)', 
            border: '1px solid var(--ring-lifecycle)'
          }}
        >
          {/* Header with toggles */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
                Lifecycle Breakdown
              </h2>
              <p className="text-base" style={{ color: 'var(--text-sub)' }}>
                {currentCategory?.label} — {getCurrentUnit()} per m²
              </p>
            </div>

            {/* Multi-Impact Category Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {impactCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setImpactCategory(cat.value);
                    lifecycleStore.setImpactCategory(cat.value);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    impactCategory === cat.value ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    background: impactCategory === cat.value ? 'var(--phase-prod)' : 'rgba(255, 255, 255, 0.5)',
                    color: impactCategory === cat.value ? 'white' : 'var(--text)',
                    borderBottom: impactCategory === cat.value ? '3px solid var(--phase-prod)' : 'none',
                  }}
                >
                  {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode and Chart Mode Toggles */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewMode("impact");
                  lifecycleStore.setViewMode("impact");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "impact" ? 'shadow-md' : ''
                }`}
                style={{
                  background: viewMode === "impact" ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text)',
                  border: viewMode === "impact" ? '2px solid var(--phase-prod)' : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Impact View
              </button>
              <button
                onClick={() => {
                  setViewMode("cpi");
                  lifecycleStore.setViewMode("cpi");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "cpi" ? 'shadow-md' : ''
                }`}
                style={{
                  background: viewMode === "cpi" ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text)',
                  border: viewMode === "cpi" ? '2px solid var(--phase-prod)' : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Cost ↔ Impact (CPI)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setChartMode("absolute");
                  lifecycleStore.setChartMode("absolute");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  chartMode === "absolute" ? 'shadow-md' : ''
                }`}
                style={{
                  background: chartMode === "absolute" ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text)',
                  border: chartMode === "absolute" ? '2px solid var(--phase-prod)' : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                Absolute
              </button>
              <button
                onClick={() => {
                  setChartMode("percentage");
                  lifecycleStore.setChartMode("percentage");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  chartMode === "percentage" ? 'shadow-md' : ''
                }`}
                style={{
                  background: chartMode === "percentage" ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text)',
                  border: chartMode === "percentage" ? '2px solid var(--phase-prod)' : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                % of Total
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {phases.map((phase) => (
              <div
                key={phase}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all"
                style={{
                  background: activePhase === phase ? 'white' : 'rgba(255, 255, 255, 0.7)',
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
          <motion.div 
            className="flex-1 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedRows}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                <XAxis 
                  type="number" 
                  stroke="var(--text-sub)"
                  domain={chartMode === "percentage" ? [0, 100] : undefined}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={190}
                  interval={0}
                  stroke="var(--text)"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
                {phases.map((phase) => (
                  <Bar
                    key={phase}
                    dataKey={phase}
                    stackId="lc"
                    fill={phaseConfig[phase].fill}
                    isAnimationActive={true}
                    animationDuration={600}
                    animationEasing="ease-in-out"
                    onMouseEnter={(data) => handleBarMouseEnter(data.name, phase)}
                    onMouseLeave={handleBarMouseLeave}
                    onClick={(data, index, event) => handleBarClick(data, phase, event)}
                    style={{ cursor: 'pointer' }}
                  >
                    {transformedRows.map((row) => (
                      <Cell
                        key={`cell-${row.name}-${phase}`}
                        opacity={activeMaterial === row.name && activePhase === phase ? 1 : 0.9}
                        stroke={activeMaterial === row.name && activePhase === phase ? '#3A6E5E' : 'none'}
                        strokeWidth={activeMaterial === row.name && activePhase === phase ? 1.5 : 0}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Anchored info panel with tooltip */}
          {activeRow && activePhase && originalRow && (
            <motion.div 
              className="mt-4 p-4 rounded-xl border"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'var(--ring-lifecycle)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: phaseConfig[activePhase].fill }}
                  />
                  <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                    {activeMaterial} — {phaseConfig[activePhase].label}
                  </h4>
                </div>
                <ImpactCard
                  lis={originalRow.lis}
                  ris={originalRow.ris}
                  risTier={originalRow.risTier}
                  cpi={originalRow.cpi}
                  materialName=""
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                <div>
                  <span style={{ color: 'var(--text-sub)' }}>Phase Impact:</span>
                  <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                    {activeRow[activePhase].toFixed(chartMode === "percentage" ? 1 : 2)} {getCurrentUnit()}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-sub)' }}>Total Impact:</span>
                  <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                    {activeRow.total?.toFixed(chartMode === "percentage" ? 0 : 2)} {getCurrentUnit()}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-sub)' }}>Source:</span>
                  <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                    EPD #4123 | 2023
                  </div>
                </div>
              </div>
            </motion.div>
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

      {/* Impact Sidebar */}
      <ImpactSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        material={sidebarRow || null}
        phase={selectedPhase}
        phaseValue={
          sidebarRow && selectedPhase
            ? sidebarRow.impacts[impactCategory][phases.indexOf(selectedPhase)]
            : 0
        }
        phaseColor={selectedPhase ? phaseConfig[selectedPhase].fill : ''}
        phaseLabel={selectedPhase ? phaseConfig[selectedPhase].label : ''}
      />
    </>
  );
}
