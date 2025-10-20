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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AnchoredTooltip } from "@/components/AnchoredTooltip";
import { PhaseDetailsDrawer } from "@/components/PhaseDetailsDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

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
    color: "#B4E197",
  },
  Transport: {
    label: "Transport",
    shortLabel: "Transport",
    color: "#5CB3FF",
  },
  Construction: {
    label: "Construction",
    shortLabel: "Construction",
    color: "#FF7F50",
  },
  Maintenance: {
    label: "Maintenance",
    shortLabel: "Maintenance",
    color: "#FFB347",
  },
  Disposal: {
    label: "End of Life",
    shortLabel: "End of Life",
    color: "#C96DD8",
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
  const isMobile = useIsMobile();

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
          fill={phaseConfig[phase].color}
          opacity={0.9}
          filter="url(#chip-shadow)"
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Card ref={cardRef} className="rounded-2xl shadow-lg min-h-[520px] md:min-h-[560px] relative">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Lifecycle Breakdown
            </CardTitle>
            <CardDescription>
              Stacked horizontal bars by lifecycle phase (mock data). Units shown
              are {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per material. Hover to explore, click for details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Filter Materials
                </label>
                <Input
                  placeholder="Search materials..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Units
                </label>
                <Select
                  value={units}
                  onValueChange={(value: "kgCO2e" | "MJ") => setUnits(value)}
                >
                  <SelectTrigger>
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
              className="h-[420px] md:h-[480px] relative"
              role="region"
              aria-label="Lifecycle breakdown chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  layout="vertical"
                  margin={{ top: 12, right: 24, bottom: 20, left: 150 }}
                  barGap={3}
                  barCategoryGap="20%"
                  barSize={isMobile ? 24 : 28}
                >
                  <defs>
                    <filter id="chip-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
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
                    width={140}
                  />
                  <Tooltip content={<div />} cursor={{ fill: "hsl(var(--accent) / 0.1)" }} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                    }}
                    formatter={(value) =>
                      phaseConfig[value as PhaseKey]?.label || value
                    }
                  />
                  <Bar
                    dataKey="PointOfOriginProduction"
                    stackId="a"
                    radius={[6, 0, 0, 6]}
                    fill={phaseConfig.PointOfOriginProduction.color}
                    label={(props: any) => renderSegmentLabel(props, "PointOfOriginProduction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-pop-${row.material}`}
                        fill={phaseConfig.PointOfOriginProduction.color}
                        stroke={activeMaterial === row.material && activePhase === "PointOfOriginProduction" ? "currentColor" : "none"}
                        strokeWidth={2}
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
                    fill={phaseConfig.Transport.color}
                    label={(props: any) => renderSegmentLabel(props, "Transport", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-transport-${row.material}`}
                        fill={phaseConfig.Transport.color}
                        stroke={activeMaterial === row.material && activePhase === "Transport" ? "currentColor" : "none"}
                        strokeWidth={2}
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
                    fill={phaseConfig.Construction.color}
                    label={(props: any) => renderSegmentLabel(props, "Construction", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-construction-${row.material}`}
                        fill={phaseConfig.Construction.color}
                        stroke={activeMaterial === row.material && activePhase === "Construction" ? "currentColor" : "none"}
                        strokeWidth={2}
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
                    fill={phaseConfig.Maintenance.color}
                    label={(props: any) => renderSegmentLabel(props, "Maintenance", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-maintenance-${row.material}`}
                        fill={phaseConfig.Maintenance.color}
                        stroke={activeMaterial === row.material && activePhase === "Maintenance" ? "currentColor" : "none"}
                        strokeWidth={2}
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
                    fill={phaseConfig.Disposal.color}
                    label={(props: any) => renderSegmentLabel(props, "Disposal", props.name)}
                  >
                    {filteredData.map((row) => (
                      <Cell
                        key={`cell-disposal-${row.material}`}
                        fill={phaseConfig.Disposal.color}
                        stroke={activeMaterial === row.material && activePhase === "Disposal" ? "currentColor" : "none"}
                        strokeWidth={2}
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
              <div className="text-center py-8 text-muted-foreground">
                No materials found matching "{filter}"
              </div>
            )}
          </CardContent>

          {/* Anchored hover panel overlay */}
          {panelData && anchor && activeMaterial && (
            <AnchoredTooltip
              active={true}
              payload={Object.keys(phaseConfig).map((key) => ({
                dataKey: key,
                name: key,
                value: panelData[key as PhaseKey],
                color: phaseConfig[key as PhaseKey].color,
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
        </Card>

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
