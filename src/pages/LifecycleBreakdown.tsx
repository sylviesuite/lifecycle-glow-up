import { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AnchoredTooltip } from "@/components/AnchoredTooltip";
import { PhaseDetailsDrawer } from "@/components/PhaseDetailsDrawer";

export type PhaseKey =
  | "PointOfOriginProduction"
  | "Transport"
  | "Construction"
  | "Maintenance"
  | "Disposal";

type Row = {
  material: string;
  PointOfOriginProduction: number;
  Transport: number;
  Construction: number;
  Maintenance: number;
  Disposal: number;
  total?: number;
};

const mockData: Row[] = [
  {
    material: "Rammed Earth",
    PointOfOriginProduction: 38,
    Transport: 6,
    Construction: 14,
    Maintenance: 3,
    Disposal: 5,
  },
  {
    material: "2x6 Wall",
    PointOfOriginProduction: 64,
    Transport: 9,
    Construction: 18,
    Maintenance: 12,
    Disposal: 8,
  },
  {
    material: "Hempcrete (6\" infill)",
    PointOfOriginProduction: 22,
    Transport: 7,
    Construction: 16,
    Maintenance: 5,
    Disposal: 4,
  },
  {
    material: "Drywall 4x8 (1/2\")",
    PointOfOriginProduction: 31,
    Transport: 5,
    Construction: 10,
    Maintenance: 2,
    Disposal: 7,
  },
].map((r) => ({
  ...r,
  total:
    r.PointOfOriginProduction +
    r.Transport +
    r.Construction +
    r.Maintenance +
    r.Disposal,
}));

export const phaseConfig = {
  PointOfOriginProduction: {
    label: "Point of Origin → Production",
    shortLabel: "Production",
    colorClass: "text-emerald-500",
  },
  Transport: {
    label: "Transport",
    shortLabel: "Transport",
    colorClass: "text-sky-500",
  },
  Construction: {
    label: "Construction",
    shortLabel: "Construction",
    colorClass: "text-amber-500",
  },
  Maintenance: {
    label: "Maintenance",
    shortLabel: "Maintenance",
    colorClass: "text-fuchsia-500",
  },
  Disposal: {
    label: "End of Life",
    shortLabel: "End of Life",
    colorClass: "text-rose-500",
  },
};

const LifecycleBreakdown = () => {
  const [units, setUnits] = useState<"kgCO2e" | "MJ">("kgCO2e");
  const [filter, setFilter] = useState("");
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<PhaseKey | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<{
    material: string;
    phase: PhaseKey;
    value: number;
  } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredData = mockData.filter((row) =>
    row.material.toLowerCase().includes(filter.toLowerCase())
  );

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const renderSegmentLabel = (props: any, phase: PhaseKey, material: string) => {
    const { x, y, width, height, value } = props;
    
    if (activeMaterial !== material || activePhase !== phase || !value) {
      return null;
    }

    const minWidth = 36;
    const isNarrow = width < minWidth;
    
    const labelText = phaseConfig[phase].label;
    const padding = 8;
    const chipHeight = 22;
    const chipWidth = Math.max(labelText.length * 6.5 + padding * 2, 80);
    
    const chipX = isNarrow 
      ? x + width - chipWidth 
      : x + width / 2 - chipWidth / 2;
    const chipY = isNarrow 
      ? y - chipHeight - 4 
      : y + height / 2 - chipHeight / 2;

    return (
      <g>
        <rect
          x={chipX}
          y={chipY}
          width={chipWidth}
          height={chipHeight}
          rx={chipHeight / 2}
          fill="currentColor"
          opacity={0.9}
          filter="url(#chip-shadow)"
          className={phaseConfig[phase].colorClass}
        />
        <text
          x={chipX + chipWidth / 2}
          y={chipY + chipHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="11"
          fontWeight="600"
        >
          {labelText}
        </text>
      </g>
    );
  };

  const handleBarMouseMove = (
    material: string,
    phase: PhaseKey,
    ev: React.MouseEvent
  ) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setActiveMaterial(material);
    setActivePhase(phase);
    setAnchor({
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top,
    });
  };

  const handleBarMouseLeave = () => {
    setActivePhase(null);
    setActiveMaterial(null);
    setAnchor(null);
  };

  const openPhaseDetails = (material: string, phase: PhaseKey, value: number) => {
    setSelectedPhase({ material, phase, value });
  };

  const panelData = activeMaterial
    ? filteredData.find((d) => d.material === activeMaterial)
    : null;

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        {/* Soft radial + linear gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_0%,_#b8e1d6_18%,_transparent_60%),radial-gradient(1000px_500px_at_85%_10%,_#dfeee9_20%,_transparent_60%),linear-gradient(180deg,_#f5f7f8_0%,_#eef3f1_60%,_#e9efed_100%)]" />
        {/* Faint noise */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><rect fill=%22%23ffffff%22 fill-opacity=%220.04%22 width=%2240%22 height=%2240%22/></svg>')]" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <section ref={cardRef} className="rounded-2xl bg-white/85 backdrop-blur-sm ring-1 ring-black/5 shadow-lg p-5 md:p-7 min-h-[520px] md:min-h-[560px] relative">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Lifecycle Breakdown
            </h1>
            <p className="text-slate-600">
              Stacked horizontal bars by lifecycle phase (mock data). Units shown
              are {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per material. Hover to explore, click for details.
            </p>
          </div>
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold mb-2 block">
                  Filter Materials
                </label>
                <Input
                  placeholder="Search materials..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="max-w-sm rounded-xl border-black/10 bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-emerald-500/25"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="text-sm font-semibold mb-2 block">
                  Units
                </label>
                <Select
                  value={units}
                  onValueChange={(value: "kgCO2e" | "MJ") => setUnits(value)}
                >
                  <SelectTrigger className="rounded-xl border-black/10 bg-white/90 backdrop-blur-sm shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kgCO2e">kg CO₂e</SelectItem>
                    <SelectItem value="MJ">MJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div
              className="h-[460px] md:h-[520px] relative"
              role="region"
              aria-label="Lifecycle breakdown chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  layout="vertical"
                  margin={{ top: 12, right: 24, bottom: 24, left: 170 }}
                  barGap={3}
                  barCategoryGap="20%"
                  barSize={28}
                >
                  <defs>
                    <filter id="chip-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(2, 6, 23, 0.06)"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={formatNumber}
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    dataKey="material"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                    width={160}
                  />
                  <Tooltip content={<div />} cursor={{ fill: "hsl(var(--accent) / 0.1)" }} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                    content={(props) => {
                      const { payload } = props;
                      if (!payload) return null;
                      return (
                        <ul className="flex flex-wrap justify-center gap-3 px-4">
                          {payload.map((item: any) => {
                            const phaseKey = item.dataKey as PhaseKey;
                            const isActive = activePhase === phaseKey;
                            const colorClass = phaseConfig[phaseKey].colorClass;
                            return (
                              <li
                                key={phaseKey}
                                className={`flex items-center gap-2 transition-all ${colorClass} rounded-md px-2 py-0.5 ${
                                  isActive
                                    ? "ring-2 ring-current font-semibold bg-white"
                                    : "bg-white/70 ring-1 ring-black/5"
                                }`}
                              >
                                <span className="inline-block w-3 h-3 rounded-sm bg-current" />
                                <span className="text-xs text-slate-700 font-medium">
                                  {phaseConfig[phaseKey].label}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }}
                  />
                  <Bar
                    dataKey="PointOfOriginProduction"
                    stackId="a"
                    radius={[6, 0, 0, 6]}
                    fill="currentColor"
                    className={phaseConfig.PointOfOriginProduction.colorClass}
                    label={(props: any) => renderSegmentLabel(props, "PointOfOriginProduction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-pop-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "PointOfOriginProduction" ? "currentColor" : "none"}
                        strokeWidth={2}
                        opacity={activeMaterial === row.material && activePhase === "PointOfOriginProduction" ? 1 : 0.85}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "PointOfOriginProduction", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "PointOfOriginProduction", row.PointOfOriginProduction)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Transport"
                    stackId="a"
                    fill="currentColor"
                    className={phaseConfig.Transport.colorClass}
                    label={(props: any) => renderSegmentLabel(props, "Transport", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-transport-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Transport" ? "currentColor" : "none"}
                        strokeWidth={2}
                        opacity={activeMaterial === row.material && activePhase === "Transport" ? 1 : 0.85}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Transport", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Transport", row.Transport)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Construction"
                    stackId="a"
                    fill="currentColor"
                    className={phaseConfig.Construction.colorClass}
                    label={(props: any) => renderSegmentLabel(props, "Construction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-construction-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Construction" ? "currentColor" : "none"}
                        strokeWidth={2}
                        opacity={activeMaterial === row.material && activePhase === "Construction" ? 1 : 0.85}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Construction", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Construction", row.Construction)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Maintenance"
                    stackId="a"
                    fill="currentColor"
                    className={phaseConfig.Maintenance.colorClass}
                    label={(props: any) => renderSegmentLabel(props, "Maintenance", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-maintenance-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Maintenance" ? "currentColor" : "none"}
                        strokeWidth={2}
                        opacity={activeMaterial === row.material && activePhase === "Maintenance" ? 1 : 0.85}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Maintenance", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Maintenance", row.Maintenance)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Disposal"
                    stackId="a"
                    radius={[0, 6, 6, 0]}
                    fill="currentColor"
                    className={phaseConfig.Disposal.colorClass}
                    label={(props: any) => renderSegmentLabel(props, "Disposal", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-disposal-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Disposal" ? "currentColor" : "none"}
                        strokeWidth={2}
                        opacity={activeMaterial === row.material && activePhase === "Disposal" ? 1 : 0.85}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Disposal", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Disposal", row.Disposal)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No materials found matching "{filter}"
              </div>
            )}
          </div>

          {/* Anchored hover panel overlay */}
          {panelData && anchor && activeMaterial && (
            <AnchoredTooltip
              active={true}
              payload={Object.keys(phaseConfig).map((key) => ({
                dataKey: key,
                name: key,
                value: panelData[key as PhaseKey],
                colorClass: phaseConfig[key as PhaseKey].colorClass,
              }))}
              label={activeMaterial}
              coordinate={{ x: anchor.x, y: anchor.y }}
              viewBox={{
                x: 0,
                y: 0,
                width: cardRef.current?.offsetWidth || 0,
                height: cardRef.current?.offsetHeight || 0,
              }}
              activePhase={activePhase}
              onPhaseClick={(phase) => {
                if (panelData) {
                  openPhaseDetails(activeMaterial, phase, panelData[phase]);
                }
              }}
              units={units}
            />
          )}
        </section>

        <PhaseDetailsDrawer
          open={!!selectedPhase}
          onOpenChange={(open) => !open && setSelectedPhase(null)}
          material={selectedPhase?.material || ""}
          phase={selectedPhase?.phase || null}
          value={selectedPhase?.value || 0}
          units={units}
        />
      </div>
    </div>
  );
};

export default LifecycleBreakdown;
