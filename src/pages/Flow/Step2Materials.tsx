import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { lifecycleStore, mockData } from "@/store/lifecycleStore";
import { ChevronLeft } from "lucide-react";

interface Step2MaterialsProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Materials({ onNext, onBack }: Step2MaterialsProps) {
  const [selectedAssemblies, setSelectedAssemblies] = useState<string[]>(
    lifecycleStore.getState().selectedAssemblies
  );

  useEffect(() => {
    lifecycleStore.setSelectedAssemblies(selectedAssemblies);
  }, [selectedAssemblies]);

  const toggleAssembly = (name: string) => {
    setSelectedAssemblies(prev => {
      if (prev.includes(name)) {
        return prev.filter(a => a !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const searchQuery = lifecycleStore.getState().searchQuery;
  const filteredMaterials = mockData.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Material Selection
          </h2>
          <p className="text-base mb-2" style={{ color: 'var(--text-sub)' }}>
            Select assemblies to compare in the lifecycle breakdown
          </p>
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              background: 'var(--phase-prod)', 
              color: 'white' 
            }}
          >
            {selectedAssemblies.length} selected
          </div>
        </div>

        <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2">
          {filteredMaterials.map((material) => (
            <div
              key={material.name}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
              style={{
                background: selectedAssemblies.includes(material.name) 
                  ? 'rgba(94, 146, 119, 0.1)' 
                  : 'var(--canvas)',
                borderColor: selectedAssemblies.includes(material.name)
                  ? 'var(--phase-prod)'
                  : 'var(--ring-lifecycle)',
              }}
            >
              <Checkbox
                id={material.name}
                checked={selectedAssemblies.includes(material.name)}
                onCheckedChange={() => toggleAssembly(material.name)}
              />
              <label
                htmlFor={material.name}
                className="flex-1 text-base font-medium cursor-pointer"
                style={{ color: 'var(--text)' }}
              >
                {material.name}
              </label>
              <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
                {material.total} kg CO₂e
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 py-3 rounded-xl text-base font-medium shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={selectedAssemblies.length === 0}
            className="px-8 py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            style={{
              background: selectedAssemblies.length > 0 ? 'var(--phase-prod)' : 'var(--text-sub)',
              color: 'white',
            }}
          >
            Next: Lifecycle Breakdown
          </Button>
        </div>
      </div>
    </div>
  );
}
