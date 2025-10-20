import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { lifecycleStore, mockData } from "@/store/lifecycleStore";
import { ChevronLeft, Info } from "lucide-react";
import { MaterialCompositionModal } from "@/components/MaterialCompositionModal";

interface Step2MaterialsProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Materials({ onNext, onBack }: Step2MaterialsProps) {
  const [selectedAssemblies, setSelectedAssemblies] = useState<string[]>(
    lifecycleStore.getState().selectedAssemblies
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [lowCarbonOnly, setLowCarbonOnly] = useState(false);
  const [localSourceOnly, setLocalSourceOnly] = useState(false);
  const [highRISOnly, setHighRISOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");

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

  const openModal = (materialName: string) => {
    setSelectedMaterial(materialName);
    setModalOpen(true);
  };

  // Debounced and filtered materials
  const filteredMaterials = useMemo(() => {
    let filtered = mockData.filter(row =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (lowCarbonOnly) {
      filtered = filtered.filter(row => (row.total || 0) < 60);
    }

    if (localSourceOnly) {
      // Mock filter: assume materials with lower transport values are "local"
      filtered = filtered.filter(row => row.Transport < 7);
    }

    if (highRISOnly) {
      // Mock filter: assume materials with lower totals have higher RIS scores
      filtered = filtered.filter(row => (row.total || 0) < 70);
    }

    return filtered;
  }, [searchQuery, lowCarbonOnly, localSourceOnly, highRISOnly]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      <div 
        className="w-full max-w-2xl h-[calc(100vh-3rem)] flex flex-col rounded-2xl backdrop-blur-sm shadow-md p-8"
        style={{ 
          background: 'var(--canvas)', 
          border: '1px solid var(--ring-lifecycle)' 
        }}
      >
        <div className="mb-6 text-center">
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

        {/* Search and Filter Chips */}
        <div className="mb-4 shrink-0">
          <Input
            placeholder="Search materials by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border px-3 py-2 shadow-inner mb-3"
            style={{
              borderColor: 'var(--ring-lifecycle)',
              background: 'var(--canvas)',
              color: 'var(--text)',
            }}
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setLowCarbonOnly(!lowCarbonOnly)}
              className={`rounded-full px-3 py-1 text-sm transition-all ${
                lowCarbonOnly ? 'font-semibold ring-2' : 'ring-1'
              }`}
              style={{
                background: lowCarbonOnly ? 'rgba(94, 146, 119, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                color: 'var(--text)',
                borderColor: lowCarbonOnly ? 'var(--phase-prod)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              Low Carbon Only
            </button>
            <button
              onClick={() => setLocalSourceOnly(!localSourceOnly)}
              className={`rounded-full px-3 py-1 text-sm transition-all ${
                localSourceOnly ? 'font-semibold ring-2' : 'ring-1'
              }`}
              style={{
                background: localSourceOnly ? 'rgba(94, 146, 119, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                color: 'var(--text)',
                borderColor: localSourceOnly ? 'var(--phase-prod)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              Local Source (&lt; 300 km)
            </button>
            <button
              onClick={() => setHighRISOnly(!highRISOnly)}
              className={`rounded-full px-3 py-1 text-sm transition-all ${
                highRISOnly ? 'font-semibold ring-2' : 'ring-1'
              }`}
              style={{
                background: highRISOnly ? 'rgba(94, 146, 119, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                color: 'var(--text)',
                borderColor: highRISOnly ? 'var(--phase-prod)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              High RIS Score (&gt; 60)
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 mb-6">
          <div className="space-y-3">
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
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
                  {material.total} kg CO₂e
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(material.name);
                  }}
                  className="cursor-help transition-colors"
                  style={{ color: 'var(--text-sub)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-sub)'}
                  title="View composition"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between shrink-0">
          <Button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-base font-medium shadow-sm"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
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

      <MaterialCompositionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        assemblyName={selectedMaterial}
      />
    </div>
  );
}
