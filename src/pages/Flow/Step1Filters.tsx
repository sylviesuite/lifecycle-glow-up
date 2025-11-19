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
  const [scopePhase, setScopePhase] = useState(lifecycleStore.getState().scopePhase);
  const [units, setUnits] = useState(lifecycleStore.getState().units);

  useEffect(() => {
    lifecycleStore.setCategory(category);
  }, [category]);

  useEffect(() => {
    lifecycleStore.setScope(scope);
  }, [scope]);

  useEffect(() => {
    lifecycleStore.setScopePhase(scopePhase);
  }, [scopePhase]);

  useEffect(() => {
    lifecycleStore.setUnits(units);
  }, [units]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden relative"
      style={{
        background: '#0B0F16',
      }}
    >
      {/* Glowing radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #09FBD3 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #FF8E4A 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, #8378FF 0%, transparent 70%)' }}
        />
      </div>

      {/* Frosted glass card */}
      <div 
        className="w-full max-w-2xl rounded-3xl p-8 relative z-10"
        style={{ 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 30px rgba(9, 251, 211, 0.25)'
        }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#F9FAFB' }}>
            Filters & Project Setup
          </h2>
          <p className="text-base" style={{ color: '#9CA3AF' }}>
            Configure your analysis parameters before selecting materials
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: '#F9FAFB' }}>
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger 
                className="rounded-xl shadow-inner transition-all focus-within:shadow-[0_0_12px_rgba(9,251,211,0.4)]"
                style={{ 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  border: '1px solid rgba(148, 163, 184, 0.7)',
                  color: '#F9FAFB'
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
            <label className="text-sm font-semibold mb-2 block" style={{ color: '#F9FAFB' }}>
              Lifecycle Scope
            </label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger 
                className="rounded-xl shadow-inner transition-all focus-within:shadow-[0_0_12px_rgba(9,251,211,0.4)]"
                style={{ 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  border: '1px solid rgba(148, 163, 184, 0.7)',
                  color: '#F9FAFB'
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
            <label className="text-sm font-semibold mb-2 block" style={{ color: '#F9FAFB' }}>
              Scope
            </label>
            <Select value={scopePhase} onValueChange={(val: "A1-A5" | "A1-C4" | "A1-D") => setScopePhase(val)}>
              <SelectTrigger 
                className="rounded-xl shadow-inner transition-all focus-within:shadow-[0_0_12px_rgba(9,251,211,0.4)]"
                style={{ 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  border: '1px solid rgba(148, 163, 184, 0.7)',
                  color: '#F9FAFB'
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1-A5">A1–A5 (Build Stage only)</SelectItem>
                <SelectItem value="A1-C4">A1–C4 (Full Lifecycle)</SelectItem>
                <SelectItem value="A1-D">A1–D (Circular System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: '#F9FAFB' }}>
              Units
            </label>
            <Select value={units} onValueChange={(val: "kgCO2e" | "MJ") => setUnits(val)}>
              <SelectTrigger 
                className="rounded-xl shadow-inner transition-all focus-within:shadow-[0_0_12px_rgba(9,251,211,0.4)]"
                style={{ 
                  background: 'rgba(15, 23, 42, 0.75)', 
                  border: '1px solid rgba(148, 163, 184, 0.7)',
                  color: '#F9FAFB'
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
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-xl text-base font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 50%, #FF8E4A 100%)',
              color: '#0B0F16',
              boxShadow: '0 0 24px rgba(9, 251, 211, 0.6)'
            }}
          >
            Next: Select Materials
          </Button>
        </div>
      </div>
    </div>
  );
}
