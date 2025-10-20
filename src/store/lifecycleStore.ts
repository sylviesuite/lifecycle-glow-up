import { PhaseKey } from "@/pages/LifecycleBreakdown";

export type ImpactCategory = "CO2e" | "Water" | "Acidification" | "Resource" | "Energy";
export type ScoreTier = "Gold" | "Silver" | "Bronze" | "Problematic";

export type Row = {
  name: string;
  "Point of Origin → Production": number;
  Transport: number;
  Construction: number;
  Maintenance: number;
  "End of Life": number;
  total?: number;
  capex: number;
  maintPerYear: number;
  energyPerYear: number;
  salvageValue: number;
  lifespanYears: number;
  lis: number;
  ris: number;
  risTier: ScoreTier;
  cpi: number;
  costPerM2: number;
  impacts: {
    CO2e: number[];
    Water: number[];
    Acidification: number[];
    Resource: number[];
    Energy: number[];
  };
};

export const mockData: Row[] = [
  {
    name: "Rammed Earth",
    "Point of Origin → Production": 38,
    Transport: 6,
    Construction: 14,
    Maintenance: 3,
    "End of Life": 5,
    capex: 85,
    maintPerYear: 1.2,
    energyPerYear: 0.8,
    salvageValue: 5,
    lifespanYears: 50,
    lis: 78,
    ris: 85,
    risTier: "Gold" as ScoreTier,
    cpi: 0.65,
    costPerM2: 55,
    impacts: {
      CO2e: [38, 6, 14, 3, 5],
      Water: [120, 15, 35, 8, 12],
      Acidification: [0.8, 0.2, 0.4, 0.1, 0.15],
      Resource: [45, 8, 18, 5, 7],
      Energy: [580, 95, 220, 45, 75],
    },
  },
  {
    name: "2x6 Wall",
    "Point of Origin → Production": 64,
    Transport: 9,
    Construction: 18,
    Maintenance: 12,
    "End of Life": 8,
    capex: 120,
    maintPerYear: 2.5,
    energyPerYear: 1.5,
    salvageValue: 8,
    lifespanYears: 30,
    lis: 54,
    ris: 58,
    risTier: "Bronze" as ScoreTier,
    cpi: 1.08,
    costPerM2: 120,
    impacts: {
      CO2e: [64, 9, 18, 12, 8],
      Water: [280, 22, 48, 35, 18],
      Acidification: [1.6, 0.3, 0.6, 0.4, 0.25],
      Resource: [85, 12, 24, 16, 10],
      Energy: [920, 135, 280, 185, 120],
    },
  },
  {
    name: "Hempcrete (6\" infill)",
    "Point of Origin → Production": 22,
    Transport: 7,
    Construction: 16,
    Maintenance: 5,
    "End of Life": 4,
    capex: 95,
    maintPerYear: 1.0,
    energyPerYear: 0.5,
    salvageValue: 6,
    lifespanYears: 40,
    lis: 72,
    ris: 76,
    risTier: "Silver" as ScoreTier,
    cpi: 0.87,
    costPerM2: 47,
    impacts: {
      CO2e: [22, 7, 16, 5, 4],
      Water: [95, 18, 38, 12, 9],
      Acidification: [0.5, 0.25, 0.5, 0.15, 0.1],
      Resource: [35, 9, 20, 8, 6],
      Energy: [340, 105, 245, 75, 60],
    },
  },
  {
    name: "Drywall 4x8 (1/2\")",
    "Point of Origin → Production": 31,
    Transport: 5,
    Construction: 10,
    Maintenance: 2,
    "End of Life": 7,
    capex: 45,
    maintPerYear: 0.8,
    energyPerYear: 0.3,
    salvageValue: 2,
    lifespanYears: 25,
    lis: 62,
    ris: 65,
    risTier: "Silver" as ScoreTier,
    cpi: 0.82,
    costPerM2: 45,
    impacts: {
      CO2e: [31, 5, 10, 2, 7],
      Water: [145, 12, 28, 6, 16],
      Acidification: [0.9, 0.15, 0.3, 0.08, 0.2],
      Resource: [52, 7, 14, 4, 9],
      Energy: [475, 75, 155, 30, 105],
    },
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

type LifecycleState = {
  category: string;
  scope: string;
  scopePhase: "A1-A5" | "A1-C4" | "A1-D";
  units: "kgCO2e" | "MJ";
  searchQuery: string;
  selectedAssemblies: string[];
  years: number;
  discountRate: number;
  baseline: string | null;
  impactCategory: ImpactCategory;
  chartMode: "absolute" | "percentage";
  viewMode: "impact" | "cpi";
};

const state: LifecycleState = {
  category: "Wall Systems",
  scope: "A1-A5",
  scopePhase: "A1-A5",
  units: "kgCO2e",
  searchQuery: "",
  selectedAssemblies: mockData.map(r => r.name), // Select all by default
  years: 30,
  discountRate: 3,
  baseline: null,
  impactCategory: "CO2e",
  chartMode: "absolute",
  viewMode: "impact",
};

export const lifecycleStore = {
  getState: () => ({ ...state }),
  
  setCategory: (category: string) => {
    state.category = category;
  },
  
  setScope: (scope: string) => {
    state.scope = scope;
  },
  
  setScopePhase: (scopePhase: "A1-A5" | "A1-C4" | "A1-D") => {
    state.scopePhase = scopePhase;
  },
  
  setUnits: (units: "kgCO2e" | "MJ") => {
    state.units = units;
  },
  
  setSearchQuery: (query: string) => {
    state.searchQuery = query;
  },
  
  setSelectedAssemblies: (assemblies: string[]) => {
    state.selectedAssemblies = assemblies;
  },
  
  toggleAssembly: (assembly: string) => {
    const index = state.selectedAssemblies.indexOf(assembly);
    if (index > -1) {
      state.selectedAssemblies.splice(index, 1);
    } else {
      state.selectedAssemblies.push(assembly);
    }
  },
  
  setYears: (years: number) => {
    state.years = years;
  },
  
  setDiscountRate: (rate: number) => {
    state.discountRate = rate;
  },
  
  setBaseline: (baseline: string | null) => {
    state.baseline = baseline;
  },
  
  setImpactCategory: (category: ImpactCategory) => {
    state.impactCategory = category;
  },
  
  setChartMode: (mode: "absolute" | "percentage") => {
    state.chartMode = mode;
  },
  
  setViewMode: (mode: "impact" | "cpi") => {
    state.viewMode = mode;
  },
  
  getFilteredRows: () => {
    return mockData.filter(row => 
      state.selectedAssemblies.includes(row.name) &&
      row.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  },
};
