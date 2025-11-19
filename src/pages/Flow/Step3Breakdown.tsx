import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { value: "Energy", label: "Embodied Energy", unit: "MJ" },
];

export function Step3Breakdown({ onNext, onBack }: Step3BreakdownProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey | null>(null);
  const [layoutView, setLayoutView] = useState<"chart" | "tiles">("tiles");
  const [activePhaseFilters, setActivePhaseFilters] = useState<Set<PhaseKey>>(new Set());
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

  const handleTileClick = (materialName: string) => {
    setSelectedMaterial(materialName);
    setSelectedPhase("Point of Origin → Production"); // Default to first phase
    setSidebarOpen(true);
  };

  const activeRow = transformedRows.find(r => r.name === activeMaterial);
  const originalRow = rows.find(r => r.name === activeMaterial);
  const sidebarRow = rows.find(r => r.name === selectedMaterial);

  const togglePhaseFilter = (phase: PhaseKey) => {
    setActivePhaseFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phase)) {
        newSet.delete(phase);
      } else {
        newSet.add(phase);
      }
      return newSet;
    });
  };

  const getCurrentUnit = () => {
    if (viewMode === "cpi") return "$ / kg CO₂e";
    if (chartMode === "percentage") return "% of total";
    
    // Format units properly - use kg or t (tonnes) for large values
    const unit = impactCategories.find(c => c.value === impactCategory)?.unit || "kg CO₂e";
    return unit;
  };

  const currentCategory = impactCategories.find(c => c.value === impactCategory);

  return (
    <>
      <div className="flex flex-col min-h-screen p-6 overflow-hidden">
      <div 
        ref={cardRef}
        className="h-[calc(100vh-3rem)] rounded-3xl p-4 flex flex-col opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]"
        style={{ 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 30px rgba(9, 251, 211, 0.25)'
        }}
      >
        {/* Header with toggles */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1" style={{ color: '#F9FAFB' }}>
              Lifecycle Breakdown
            </h2>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {currentCategory?.label} — {getCurrentUnit()} per m²
            </p>
          </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              {/* Layout View Toggle */}
              <div className="flex rounded-lg overflow-hidden shadow-sm" style={{ border: '1px solid rgba(148, 163, 184, 0.5)' }}>
                <button
                  onClick={() => setLayoutView("tiles")}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: layoutView === "tiles" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: layoutView === "tiles" ? '#0B0F16' : '#F9FAFB',
                  }}
                >
                  Tiles
                </button>
                <button
                  onClick={() => setLayoutView("chart")}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: layoutView === "chart" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: layoutView === "chart" ? '#0B0F16' : '#F9FAFB',
                  }}
                >
                  Chart
                </button>
              </div>

              {/* Multi-Impact Category Toggle */}
              <div className="flex items-center gap-2">
                {impactCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setImpactCategory(cat.value);
                      lifecycleStore.setImpactCategory(cat.value);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      impactCategory === cat.value ? 'font-bold shadow-[0_0_16px_rgba(9,251,211,0.4)]' : 'font-medium'
                    }`}
                    style={{
                      background: impactCategory === cat.value ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                      color: impactCategory === cat.value ? '#0B0F16' : '#F9FAFB',
                      borderBottom: impactCategory === cat.value ? '3px solid var(--phase-prod)' : 'none',
                    }}
                  >
                    {cat.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Mode and Chart Mode Toggles - only show for chart view */}
          {layoutView === "chart" && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewMode("impact");
                    lifecycleStore.setViewMode("impact");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "impact" ? 'shadow-[0_0_16px_rgba(9,251,211,0.4)]' : ''
                  }`}
                  style={{
                    background: viewMode === "impact" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: viewMode === "impact" ? '#0B0F16' : '#F9FAFB',
                    border: viewMode === "impact" ? 'none' : '1px solid rgba(148, 163, 184, 0.5)',
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
                    viewMode === "cpi" ? 'shadow-[0_0_16px_rgba(9,251,211,0.4)]' : ''
                  }`}
                  style={{
                    background: viewMode === "cpi" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: viewMode === "cpi" ? '#0B0F16' : '#F9FAFB',
                    border: viewMode === "cpi" ? 'none' : '1px solid rgba(148, 163, 184, 0.5)',
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
                    chartMode === "absolute" ? 'shadow-[0_0_16px_rgba(9,251,211,0.4)]' : ''
                  }`}
                  style={{
                    background: chartMode === "absolute" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: chartMode === "absolute" ? '#0B0F16' : '#F9FAFB',
                    border: chartMode === "absolute" ? 'none' : '1px solid rgba(148, 163, 184, 0.5)',
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
                    chartMode === "percentage" ? 'shadow-[0_0_16px_rgba(9,251,211,0.4)]' : ''
                  }`}
                  style={{
                    background: chartMode === "percentage" ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: chartMode === "percentage" ? '#0B0F16' : '#F9FAFB',
                    border: chartMode === "percentage" ? 'none' : '1px solid rgba(148, 163, 184, 0.5)',
                  }}
                >
                  % of Total
                </button>
              </div>
            </div>
          )}

          {/* Phase Filter Pills */}
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
              Filter by Phase
            </p>
            <div className="flex flex-wrap gap-2">
              {phases.map((phase) => {
                const isActive = activePhaseFilters.size === 0 || activePhaseFilters.has(phase);
                return (
                  <button
                    key={phase}
                    onClick={() => togglePhaseFilter(phase)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium cursor-pointer hover:scale-105"
                    style={{
                      background: isActive ? phaseConfig[phase].fill : 'rgba(15, 23, 42, 0.5)',
                      color: isActive ? 'white' : '#9CA3AF',
                      border: `1px solid ${isActive ? phaseConfig[phase].fill : 'rgba(148, 163, 184, 0.3)'}`,
                      opacity: isActive ? 1 : 0.6,
                      boxShadow: isActive ? `0 0 12px ${phaseConfig[phase].fill}40` : 'none',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: isActive ? 'white' : phaseConfig[phase].fill }}
                    />
                    <span>{phaseConfig[phase].shortLabel}</span>
                  </button>
                );
              })}
              {activePhaseFilters.size > 0 && (
                <button
                  onClick={() => setActivePhaseFilters(new Set())}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    color: '#9CA3AF',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Conditional Rendering: Chart or Tiles */}
          {layoutView === "chart" ? (
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
                  {phases.map((phase) => {
                    const isPhaseActive = activePhaseFilters.size === 0 || activePhaseFilters.has(phase);
                    return (
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
                        {transformedRows.map((row) => {
                          const baseOpacity = isPhaseActive ? 0.9 : 0.3;
                          const hoverOpacity = activeMaterial === row.name && activePhase === phase ? 1 : baseOpacity;
                          return (
                            <Cell
                              key={`cell-${row.name}-${phase}`}
                              opacity={hoverOpacity}
                              stroke={activeMaterial === row.name && activePhase === phase ? '#3A6E5E' : 'none'}
                              strokeWidth={activeMaterial === row.name && activePhase === phase ? 1.5 : 0}
                            />
                          );
                        })}
                      </Bar>
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            /* Tile View */
            <motion.div
              className="flex-1 min-h-0 overflow-y-auto pr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
                {transformedRows.map((row) => {
                  const originalRow = rows.find(r => r.name === row.name);
                  const impactData = originalRow?.impacts[impactCategory] || [0, 0, 0, 0, 0];
                  
                  return (
                    <ImpactCard
                      key={row.name}
                      material={originalRow!}
                      onClick={() => handleTileClick(row.name)}
                      currentMetric={row.total || 0}
                      currentUnit={getCurrentUnit()}
                      phases={phases.map((phase, idx) => {
                        const isActive = activePhaseFilters.size === 0 || activePhaseFilters.has(phase);
                        return {
                          phase,
                          value: impactData[idx],
                          color: phaseConfig[phase].fill,
                          isActive,
                        };
                      })}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Anchored info panel with tooltip - only show for chart view */}
          {layoutView === "chart" && (
            <AnimatePresence mode="wait">
              {activeRow && activePhase && originalRow && (
                <motion.div 
                  key={`${activeMaterial}-${activePhase}`}
                  className="mt-4 p-4 rounded-xl border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'var(--ring-lifecycle)',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
...
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <div className="flex items-center justify-between mt-6">
            <Button
              onClick={onBack}
              className="px-6 py-3 rounded-xl text-base font-medium shadow-sm hover:scale-[1.02] transition-all"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#F9FAFB',
                border: '1px solid rgba(148, 163, 184, 0.7)',
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={onNext}
              className="px-8 py-3 rounded-xl text-base font-bold transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 50%, #FF8E4A 100%)',
                color: '#0B0F16',
                boxShadow: '0 0 24px rgba(9, 251, 211, 0.6)'
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
        impactData={sidebarRow ? sidebarRow.impacts[impactCategory] : []}
        currentUnit={getCurrentUnit()}
        activePhases={activePhaseFilters}
      />
      
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
}
