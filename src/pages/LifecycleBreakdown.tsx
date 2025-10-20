import { useState, useRef, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
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
    colorClass: "text-[color:var(--phase-prod)]",
    fill: "var(--phase-prod)",
  },
  Transport: {
    label: "Transport",
    shortLabel: "Transport",
    colorClass: "text-[color:var(--phase-trans)]",
    fill: "var(--phase-trans)",
  },
  Construction: {
    label: "Construction",
    shortLabel: "Construction",
    colorClass: "text-[color:var(--phase-cons)]",
    fill: "var(--phase-cons)",
  },
  Maintenance: {
    label: "Maintenance",
    shortLabel: "Maintenance",
    colorClass: "text-[color:var(--phase-main)]",
    fill: "var(--phase-main)",
  },
  Disposal: {
    label: "End of Life",
    shortLabel: "End of Life",
    colorClass: "text-[color:var(--phase-eol)]",
    fill: "var(--phase-eol)",
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const cardRef = useRef<HTMLDivElement>(null);

  // Theme management
  useEffect(() => {
    const saved = localStorage.getItem('bp-theme') as "light" | "dark" | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bp-theme', next);
  };

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
          fontWeight="500"
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
        {/* BlockPlane brand gradient using CSS variables */}
        <div 
          className="absolute inset-0" 
          style={{ background: 'linear-gradient(180deg, var(--bg-from), var(--bg-via), var(--bg-to))' }}
        />
        {/* Faint noise */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect fill=%22%23000000%22 fill-opacity=%220.04%22 width=%2240%22 height=%2240%22/></svg>')]" />
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <section 
          ref={cardRef} 
          className="rounded-2xl backdrop-blur-sm shadow-md p-6 min-h-[520px] md:min-h-[560px] relative"
          style={{ 
            background: 'var(--canvas)', 
            border: '1px solid var(--ring-lifecycle)' 
          }}
        >
          <div className="space-y-2 mb-6 flex items-start justify-between">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                Lifecycle Breakdown
              </h1>
              <p style={{ color: 'var(--text-sub)' }}>
                Stacked horizontal bars by lifecycle phase (mock data). Units shown
                are {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per material. Hover to explore, click for details.
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
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
                  className="max-w-sm rounded-xl backdrop-blur-sm shadow-sm"
                  style={{ 
                    background: 'var(--canvas)', 
                    borderColor: 'var(--ring-lifecycle)',
                    color: 'var(--text)'
                  }}
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
                  <SelectTrigger 
                    className="rounded-xl backdrop-blur-sm shadow-sm"
                    style={{ 
                      background: 'var(--canvas)', 
                      borderColor: 'var(--ring-lifecycle)',
                      color: 'var(--text)'
                    }}
                  >
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
              <div 
                className="rounded-xl p-3 h-full" 
                style={{ 
                  border: '1px solid var(--ring-lifecycle)',
                  background: 'rgba(255, 255, 255, 0.6)'
                }}
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
                    stroke="var(--grid)"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={formatNumber}
                    tick={{ fill: 'var(--text-sub)' }}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    dataKey="material"
                    type="category"
                    tick={{ fill: 'var(--text-sub)' }}
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
                                className={`flex items-center gap-2 transition-all ${colorClass} rounded-md px-2 py-0.5`}
                                style={{
                                  background: isActive ? 'rgba(255,255,255,0.9)' : 'var(--legend-pill)',
                                  border: `1px solid var(--ring-lifecycle)`,
                                  boxShadow: isActive ? '0 0 0 2px currentColor inset' : 'none',
                                  fontWeight: isActive ? 600 : 400
                                }}
                              >
                                <span className="inline-block w-3 h-3 rounded-sm bg-current" />
                                <span className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>
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
                    fill={phaseConfig.PointOfOriginProduction.fill}
                    label={(props: any) => renderSegmentLabel(props, "PointOfOriginProduction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-pop-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "PointOfOriginProduction" ? "#3A6E5E" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.material && activePhase === "PointOfOriginProduction" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "PointOfOriginProduction", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "PointOfOriginProduction", row.PointOfOriginProduction)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Transport"
                    stackId="a"
                    fill={phaseConfig.Transport.fill}
                    label={(props: any) => renderSegmentLabel(props, "Transport", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-transport-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Transport" ? "#3A6E5E" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.material && activePhase === "Transport" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Transport", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Transport", row.Transport)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Construction"
                    stackId="a"
                    fill={phaseConfig.Construction.fill}
                    label={(props: any) => renderSegmentLabel(props, "Construction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-construction-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Construction" ? "#3A6E5E" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.material && activePhase === "Construction" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Construction", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Construction", row.Construction)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Maintenance"
                    stackId="a"
                    fill={phaseConfig.Maintenance.fill}
                    label={(props: any) => renderSegmentLabel(props, "Maintenance", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-maintenance-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Maintenance" ? "#3A6E5E" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.material && activePhase === "Maintenance" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Maintenance", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Maintenance", row.Maintenance)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Disposal"
                    stackId="a"
                    radius={[0, 6, 6, 0]}
                    fill={phaseConfig.Disposal.fill}
                    label={(props: any) => renderSegmentLabel(props, "Disposal", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-disposal-${row.material}`}
                        stroke={activeMaterial === row.material && activePhase === "Disposal" ? "#3A6E5E" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.material && activePhase === "Disposal" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.material, "Disposal", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.material, "Disposal", row.Disposal)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8" style={{ color: 'var(--text-sub)' }}>
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
