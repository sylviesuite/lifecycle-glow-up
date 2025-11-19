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
        className="w-full max-w-2xl h-[calc(100vh-3rem)] flex flex-col rounded-3xl p-8"
        style={{ 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 30px rgba(9, 251, 211, 0.25)'
        }}
      >
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#F9FAFB' }}>
            Material Selection
          </h2>
          <p className="text-base mb-2" style={{ color: '#9CA3AF' }}>
            Select assemblies to compare in the lifecycle breakdown
          </p>
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-[0_0_16px_rgba(9,251,211,0.4)]"
            style={{ 
              background: 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 100%)', 
              color: '#0B0F16' 
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
            className="rounded-xl px-3 py-2 shadow-inner mb-3 transition-all focus-within:shadow-[0_0_12px_rgba(9,251,211,0.4)]"
            style={{
              border: '1px solid rgba(148, 163, 184, 0.7)',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#F9FAFB',
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
              className="flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-[0_0_16px_rgba(9,251,211,0.3)]"
              style={{
                background: selectedAssemblies.includes(material.name) 
                  ? 'rgba(9, 251, 211, 0.15)' 
                  : 'rgba(15, 23, 42, 0.5)',
                border: selectedAssemblies.includes(material.name)
                  ? '1px solid rgba(9, 251, 211, 0.6)'
                  : '1px solid rgba(148, 163, 184, 0.3)',
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
                style={{ color: '#F9FAFB' }}
              >
                {material.name}
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: '#9CA3AF' }}>
                  {material.total} kg CO₂e
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(material.name);
                  }}
                  className="cursor-help transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#09FBD3'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
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
            className="px-6 py-3 rounded-xl text-base font-medium shadow-sm hover:scale-[1.02] transition-all"
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#F9FAFB',
              border: '1px solid rgba(148, 163, 184, 0.7)',
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={selectedAssemblies.length === 0}
            className="px-8 py-3 rounded-xl text-base font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: selectedAssemblies.length > 0 
                ? 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 50%, #FF8E4A 100%)' 
                : 'rgba(15, 23, 42, 0.5)',
              color: selectedAssemblies.length > 0 ? '#0B0F16' : '#6B7280',
              boxShadow: selectedAssemblies.length > 0 ? '0 0 24px rgba(9, 251, 211, 0.6)' : 'none',
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
