import { PhaseKey } from "@/pages/LifecycleBreakdown";

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
  units: "kgCO2e" | "MJ";
  searchQuery: string;
  selectedAssemblies: string[];
  years: number;
  discountRate: number;
  baseline: string | null;
};

const state: LifecycleState = {
  category: "Wall Systems",
  scope: "A1-A5",
  units: "kgCO2e",
  searchQuery: "",
  selectedAssemblies: mockData.map(r => r.name), // Select all by default
  years: 30,
  discountRate: 3,
  baseline: null,
};

export const lifecycleStore = {
  getState: () => ({ ...state }),
  
  setCategory: (category: string) => {
    state.category = category;
  },
  
  setScope: (scope: string) => {
    state.scope = scope;
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
  
  getFilteredRows: () => {
    return mockData.filter(row => 
      state.selectedAssemblies.includes(row.name) &&
      row.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  },
};
