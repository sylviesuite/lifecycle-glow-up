import { useState } from "react";
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

type PhaseKey =
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

const phaseConfig = {
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

  const filteredData = mockData.filter((row) =>
    row.material.toLowerCase().includes(filter.toLowerCase())
  );

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-md">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.reverse().map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {phaseConfig[entry.dataKey as PhaseKey]?.label}:
              </span>
              <span className="font-medium text-foreground">
                {formatNumber(entry.value)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Lifecycle Breakdown
            </CardTitle>
            <CardDescription>
              Stacked horizontal bars by lifecycle phase (mock data). Units shown
              are {units === "kgCO2e" ? "kg CO₂e" : "MJ"} per material.
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
              className="h-[360px] md:h-[420px]"
              role="region"
              aria-label="Lifecycle breakdown chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  layout="vertical"
                  margin={{ top: 20, right: 280, left: 120, bottom: 20 }}
                  barGap={3}
                  barCategoryGap="20%"
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
                    width={110}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: "hsl(var(--accent))" }}
                    wrapperStyle={{ transform: 'none', position: 'absolute', right: 20, left: 'auto' }}
                  />
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
                    radius={[6, 0, 0, 6]}
                  />
                  <Bar
                    dataKey="Transport"
                    stackId="a"
                    fill={phaseConfig.Transport.color}
                  />
                  <Bar
                    dataKey="Construction"
                    stackId="a"
                    fill={phaseConfig.Construction.color}
                  />
                  <Bar
                    dataKey="Maintenance"
                    stackId="a"
                    fill={phaseConfig.Maintenance.color}
                  />
                  <Bar
                    dataKey="Disposal"
                    stackId="a"
                    fill={phaseConfig.Disposal.color}
                    radius={[0, 6, 6, 0]}
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
        </Card>
      </div>
    </div>
  );
};

export default LifecycleBreakdown;
