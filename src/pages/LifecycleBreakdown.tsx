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
import { Moon, Sun, ArrowLeft, X } from "lucide-react";
import { AnchoredTooltip } from "@/components/AnchoredTooltip";
import { PhaseDetailsDrawer } from "@/components/PhaseDetailsDrawer";

export type PhaseKey =
  | "Point of Origin → Production"
  | "Transport"
  | "Construction"
  | "Maintenance"
  | "End of Life";

type Row = {
  name: string;
  "Point of Origin → Production": number;
  Transport: number;
  Construction: number;
  Maintenance: number;
  "End of Life": number;
  total?: number;
};

const mockData: Row[] = [
  {
    name: "Rammed Earth",
    "Point of Origin → Production": 38,
    Transport: 6,
    Construction: 14,
    Maintenance: 3,
    "End of Life": 5,
  },
  {
    name: "2x6 Wall",
    "Point of Origin → Production": 64,
    Transport: 9,
    Construction: 18,
    Maintenance: 12,
    "End of Life": 8,
  },
  {
    name: "Hempcrete (6\" infill)",
    "Point of Origin → Production": 22,
    Transport: 7,
    Construction: 16,
    Maintenance: 5,
    "End of Life": 4,
  },
  {
    name: "Drywall 4x8 (1/2\")",
    "Point of Origin → Production": 31,
    Transport: 5,
    Construction: 10,
    Maintenance: 2,
    "End of Life": 7,
  },
].map((r) => ({
  ...r,
  total:
    r["Point of Origin → Production"] +
    r.Transport +
    r.Construction +
    r.Maintenance +
    r["End of Life"],
}));

export const phaseConfig: Record<PhaseKey, { label: string; shortLabel: string; colorClass: string; fill: string }> = {
  "Point of Origin → Production": {
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
  "End of Life": {
    label: "End of Life",
    shortLabel: "End of Life",
    colorClass: "text-[color:var(--phase-eol)]",
    fill: "var(--phase-eol)",
  },
};

const CALC_STEPS = [
  { key: "data", label: "Data", icon: "📄" },
  { key: "normalize", label: "Normalize", icon: "⚖️" },
  { key: "allocate", label: "Allocate", icon: "📊" },
  { key: "sum", label: "Sum", icon: "➕" },
  { key: "compare", label: "Compare", icon: "📈" },
];

function Header({ onBack, onClose, onToggleTheme, theme }: { 
  onBack?: () => void; 
  onClose?: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button
        onClick={() => (onBack ? onBack() : window.history.back())}
        className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4 text-slate-700" />
        <span className="text-sm font-medium text-slate-700">Back</span>
      </button>

      <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
        Lifecycle Breakdown
      </h1>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="shrink-0"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <button
          onClick={onClose}
          className="h-9 w-9 grid place-items-center rounded-xl border border-black/10 bg-white/70 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-700" />
        </button>
      </div>
    </div>
  );
}

function Stepper({ current = 5 }: { current?: number }) {
  return (
    <div className="mt-2 mb-4">
      <ol className="flex items-center gap-4">
        {CALC_STEPS.map((s, i) => {
          const active = i < current;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={`h-6 w-6 grid place-items-center rounded-full text-xs ${
                  active ? "bg-emerald-600 text-white" : "bg-white/70 text-slate-600 border border-black/10"
                }`}
              >
                {s.icon}
              </span>
              <span className={`text-xs ${active ? "text-slate-800 font-medium" : "text-slate-500"}`}>
                {s.label}
              </span>
              {i < CALC_STEPS.length - 1 && <span className="mx-1 h-[2px] w-8 rounded bg-black/10" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const LifecycleBreakdown = () => {
  const [units, setUnits] = useState<"kgCO2e" | "MJ">("kgCO2e");
  const [filter, setFilter] = useState("");
  const [visibleMaterials, setVisibleMaterials] = useState<Set<string>>(
    new Set(mockData.map((r) => r.name))
  );
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

  const filteredData = mockData.filter(
    (row) =>
      row.name.toLowerCase().includes(filter.toLowerCase()) &&
      visibleMaterials.has(row.name)
  );

  const toggleMaterial = (material: string) => {
    setVisibleMaterials((prev) => {
      const next = new Set(prev);
      if (next.has(material)) {
        next.delete(material);
      } else {
        next.add(material);
      }
      return next;
    });
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
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
    ? mockData.find((d) => d.name === activeMaterial)
    : null;

  const sumSelected = filteredData.reduce((sum, row) => sum + (row.total || 0), 0);

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
          <div className="mb-5">
            <Header onToggleTheme={toggleTheme} theme={theme} />
            <Stepper current={5} />
            <p style={{ color: 'var(--text-sub)' }} className="text-sm mt-2">
              Stacked horizontal bars by lifecycle phase (mock data). Units shown
              are {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per material. Hover to explore, click for details.
            </p>
          </div>
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
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
                  <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
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

              {/* Material Checkboxes */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
                  Show Materials
                </label>
                <div className="flex flex-wrap gap-3">
                  {mockData.map((row) => (
                    <label
                      key={row.name}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      style={{
                        background: visibleMaterials.has(row.name) ? 'var(--canvas)' : 'transparent',
                        border: `1px solid var(--ring-lifecycle)`,
                        color: 'var(--text-sub)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleMaterials.has(row.name)}
                        onChange={() => toggleMaterial(row.name)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{row.name}</span>
                    </label>
                  ))}
                </div>
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
                  margin={{ top: 12, right: 24, bottom: 24, left: 180 }}
                  barGap={3}
                  barCategoryGap="20%"
                  barSize={28}
                >
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
                    dataKey="name"
                    type="category"
                    tick={{ fill: 'var(--text)', fontWeight: 600 }}
                    style={{ fontSize: "13px" }}
                    width={190}
                  />
                  <Tooltip content={<div />} cursor={{ fill: "transparent" }} />
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
                                className={`flex items-center gap-2 transition-all ${colorClass} rounded-md px-3 py-1.5`}
                                style={{
                                  background: isActive ? 'white' : 'var(--legend-pill)',
                                  border: `1px solid var(--ring-lifecycle)`,
                                  boxShadow: isActive ? '0 0 0 2px currentColor inset' : 'none',
                                  fontWeight: isActive ? 600 : 500
                                }}
                              >
                                <span className="inline-block w-3 h-3 rounded-sm bg-current" />
                                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
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
                    dataKey="Point of Origin → Production"
                    stackId="lc"
                    radius={[4, 0, 0, 4]}
                    fill={phaseConfig["Point of Origin → Production"].fill}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-pop-${row.name}`}
                        stroke={activeMaterial === row.name && activePhase === "Point of Origin → Production" ? "#000000" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.name && activePhase === "Point of Origin → Production" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.name, "Point of Origin → Production", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.name, "Point of Origin → Production", row["Point of Origin → Production"])}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Transport"
                    stackId="lc"
                    radius={[4, 4, 4, 4]}
                    fill={phaseConfig.Transport.fill}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-transport-${row.name}`}
                        stroke={activeMaterial === row.name && activePhase === "Transport" ? "#000000" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.name && activePhase === "Transport" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.name, "Transport", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.name, "Transport", row.Transport)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Construction"
                    stackId="lc"
                    radius={[4, 4, 4, 4]}
                    fill={phaseConfig.Construction.fill}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-construction-${row.name}`}
                        stroke={activeMaterial === row.name && activePhase === "Construction" ? "#000000" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.name && activePhase === "Construction" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.name, "Construction", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.name, "Construction", row.Construction)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="Maintenance"
                    stackId="lc"
                    radius={[4, 4, 4, 4]}
                    fill={phaseConfig.Maintenance.fill}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-maintenance-${row.name}`}
                        stroke={activeMaterial === row.name && activePhase === "Maintenance" ? "#000000" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.name && activePhase === "Maintenance" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.name, "Maintenance", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.name, "Maintenance", row.Maintenance)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="End of Life"
                    stackId="lc"
                    radius={[0, 4, 4, 0]}
                    fill={phaseConfig["End of Life"].fill}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-eol-${row.name}`}
                        stroke={activeMaterial === row.name && activePhase === "End of Life" ? "#000000" : "none"}
                        strokeWidth={1.5}
                        opacity={activeMaterial === row.name && activePhase === "End of Life" ? 1.0 : 0.9}
                        style={{ cursor: "pointer" }}
                        onMouseMove={(ev: any) => handleBarMouseMove(row.name, "End of Life", ev)}
                        onMouseLeave={handleBarMouseLeave}
                        onClick={() => openPhaseDetails(row.name, "End of Life", row["End of Life"])}
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
              rowTotal={panelData.total || 0}
              sumSelected={sumSelected}
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
