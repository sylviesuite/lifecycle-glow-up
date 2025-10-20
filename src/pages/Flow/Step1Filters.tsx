import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lifecycleStore } from "@/store/lifecycleStore";

interface Step1FiltersProps {
  onNext: () => void;
}

export function Step1Filters({ onNext }: Step1FiltersProps) {
  const [category, setCategory] = useState(lifecycleStore.getState().category);
  const [scope, setScope] = useState(lifecycleStore.getState().scope);
  const [units, setUnits] = useState(lifecycleStore.getState().units);
  const [searchQuery, setSearchQuery] = useState(lifecycleStore.getState().searchQuery);

  useEffect(() => {
    lifecycleStore.setCategory(category);
  }, [category]);

  useEffect(() => {
    lifecycleStore.setScope(scope);
  }, [scope]);

  useEffect(() => {
    lifecycleStore.setUnits(units);
  }, [units]);

  useEffect(() => {
    lifecycleStore.setSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div 
        className="w-full max-w-2xl rounded-2xl backdrop-blur-sm shadow-md p-8"
        style={{ 
          background: 'var(--canvas)', 
          border: '1px solid var(--ring-lifecycle)' 
        }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Filters & Project Setup
          </h2>
          <p className="text-base" style={{ color: 'var(--text-sub)' }}>
            Configure your analysis parameters before selecting materials
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
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
                <SelectItem value="Wall Systems">Wall Systems</SelectItem>
                <SelectItem value="Roofing">Roofing</SelectItem>
                <SelectItem value="Slabs">Slabs</SelectItem>
                <SelectItem value="Structural">Structural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
              Lifecycle Scope
            </label>
            <Select value={scope} onValueChange={setScope}>
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
                <SelectItem value="A1-A5">A1–A5 (Production to Construction)</SelectItem>
                <SelectItem value="A1-C4">A1–C4 (Full Lifecycle)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
              Units
            </label>
            <Select value={units} onValueChange={(val: "kgCO2e" | "MJ") => setUnits(val)}>
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
                <SelectItem value="kgCO2e">kg CO₂e per m²</SelectItem>
                <SelectItem value="MJ">MJ per m²</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text)' }}>
              Search Filter
            </label>
            <Input
              placeholder="Filter materials by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl backdrop-blur-sm shadow-sm"
              style={{ 
                background: 'var(--canvas)', 
                borderColor: 'var(--ring-lifecycle)',
                color: 'var(--text)'
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
          >
            Next: Select Materials
          </Button>
        </div>
      </div>
    </div>
  );
}
