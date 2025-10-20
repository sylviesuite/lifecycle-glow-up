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
    color: "#B4E197",
  },
  Transport: {
    label: "Transport",
    color: "#5CB3FF",
  },
  Construction: {
    label: "Construction",
    color: "#FF7F50",
  },
  Maintenance: {
    label: "Maintenance",
    color: "#FFB347",
  },
  Disposal: {
    label: "End of Life",
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

  const handlePhaseClick = (material: string, phase: PhaseKey, value: number) => {
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
                    fill={phaseConfig.PointOfOriginProduction.color}
                    fillOpacity={activePhase && activePhase !== "PointOfOriginProduction" ? 0.45 : 1}
                    radius={[6, 0, 0, 6]}
                    onMouseMove={(data: any, _: any, ev: any) => 
                      handleBarMouseMove(data.material, "PointOfOriginProduction", ev)
                    }
                    onMouseLeave={handleBarMouseLeave}
                  />
                  <Bar
                    dataKey="Transport"
                    stackId="a"
                    fill={phaseConfig.Transport.color}
                    fillOpacity={activePhase && activePhase !== "Transport" ? 0.45 : 1}
                    onMouseMove={(data: any, _: any, ev: any) => 
                      handleBarMouseMove(data.material, "Transport", ev)
                    }
                    onMouseLeave={handleBarMouseLeave}
                  />
                  <Bar
                    dataKey="Construction"
                    stackId="a"
                    fill={phaseConfig.Construction.color}
                    fillOpacity={activePhase && activePhase !== "Construction" ? 0.45 : 1}
                    onMouseMove={(data: any, _: any, ev: any) => 
                      handleBarMouseMove(data.material, "Construction", ev)
                    }
                    onMouseLeave={handleBarMouseLeave}
                  />
                  <Bar
                    dataKey="Maintenance"
                    stackId="a"
                    fill={phaseConfig.Maintenance.color}
                    fillOpacity={activePhase && activePhase !== "Maintenance" ? 0.45 : 1}
                    onMouseMove={(data: any, _: any, ev: any) => 
                      handleBarMouseMove(data.material, "Maintenance", ev)
                    }
                    onMouseLeave={handleBarMouseLeave}
                  />
                  <Bar
                    dataKey="Disposal"
                    stackId="a"
                    fill={phaseConfig.Disposal.color}
                    fillOpacity={activePhase && activePhase !== "Disposal" ? 0.45 : 1}
                    radius={[0, 6, 6, 0]}
                    onMouseMove={(data: any, _: any, ev: any) => 
                      handleBarMouseMove(data.material, "Disposal", ev)
                    }
                    onMouseLeave={handleBarMouseLeave}
                  />
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
                  handlePhaseClick(activeMaterial, phase, panelData[phase]);
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
