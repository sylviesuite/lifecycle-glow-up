import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, FileText } from "lucide-react";
import { lifecycleStore } from "@/store/lifecycleStore";

interface Step4InsightsProps {
  onBack: () => void;
  onFinish: () => void;
}

export function Step4Insights({ onBack, onFinish }: Step4InsightsProps) {
  const rows = lifecycleStore.getFilteredRows();
  const units = lifecycleStore.getState().units;

  if (rows.length === 0) {
    return null;
  }

  const sorted = [...rows].sort((a, b) => (a.total || 0) - (b.total || 0));
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const average = rows.reduce((sum, r) => sum + (r.total || 0), 0) / rows.length;

  const handleExportPDF = () => {
    console.log("Export PDF - placeholder");
  };

  const handleExportCSV = () => {
    console.log("Export CSV - placeholder");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      <div 
        className="w-full max-w-3xl h-[calc(100vh-3rem)] flex flex-col rounded-2xl backdrop-blur-sm shadow-md p-8"
        style={{ 
          background: 'var(--canvas)', 
          border: '1px solid var(--ring-lifecycle)',
        }}
      >
        <div className="mb-6 text-center shrink-0">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Insights & Export
          </h2>
          <p className="text-base" style={{ color: 'var(--text-sub)' }}>
            Key takeaways from your lifecycle analysis
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          {/* Key Insights */}
          <div className="space-y-4 mb-6">
          <div 
            className="p-5 rounded-xl border-l-4"
            style={{
              background: 'rgba(94, 146, 119, 0.08)',
              borderLeftColor: 'var(--phase-prod)',
            }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
              🏆 Lowest Impact
            </h3>
            <p className="text-base" style={{ color: 'var(--text-sub)' }}>
              <span className="font-semibold" style={{ color: 'var(--text)' }}>{lowest.name}</span> has the lowest total impact at{" "}
              <span className="font-semibold">{lowest.total?.toFixed(1)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}/m²</span>
            </p>
          </div>

          <div 
            className="p-5 rounded-xl border-l-4"
            style={{
              background: 'rgba(194, 100, 110, 0.08)',
              borderLeftColor: 'var(--phase-eol)',
            }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
              🔥 Hotspot Material
            </h3>
            <p className="text-base" style={{ color: 'var(--text-sub)' }}>
              <span className="font-semibold" style={{ color: 'var(--text)' }}>{highest.name}</span> has the highest impact at{" "}
              <span className="font-semibold">{highest.total?.toFixed(1)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}/m²</span>
              {" "}— {((((highest.total || 0) - (lowest.total || 0)) / (lowest.total || 1)) * 100).toFixed(0)}% above the lowest
            </p>
          </div>

          <div 
            className="p-5 rounded-xl border-l-4"
            style={{
              background: 'rgba(79, 137, 166, 0.08)',
              borderLeftColor: 'var(--phase-trans)',
            }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
              📊 Benchmark Average
            </h3>
            <p className="text-base" style={{ color: 'var(--text-sub)' }}>
              The average impact across selected materials is{" "}
              <span className="font-semibold">{average.toFixed(1)} {units === "kgCO2e" ? "kg CO₂e" : "MJ"}/m²</span>
            </p>
          </div>
          </div>

          {/* How We Calculated */}
          <div
          className="p-5 rounded-xl mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid var(--ring-lifecycle)',
          }}
        >
          <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
            🧮 How We Calculated This
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            This analysis uses lifecycle assessment (LCA) data aggregated across five phases:
            production, transport, construction, maintenance, and end-of-life. All values are normalized
            per functional unit (m²). Data sources include EPDs, industry databases, and project-specific inputs.
          </p>
          </div>

          {/* Export Actions */}
          <div className="space-y-3 mb-4">
            <h3 className="font-semibold text-base mb-3" style={{ color: 'var(--text)' }}>
              Export Your Analysis
            </h3>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="w-full justify-start gap-3 py-5 rounded-xl text-base font-medium"
            >
              <FileText className="h-5 w-5" />
              Export as PDF Report
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="w-full justify-start gap-3 py-5 rounded-xl text-base font-medium"
            >
              <Download className="h-5 w-5" />
              Export as CSV Data
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between shrink-0 pt-4">
          <Button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-base font-medium shadow-sm"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Breakdown
          </Button>
          <Button
            onClick={onFinish}
            className="px-8 py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: 'var(--phase-prod)',
              color: 'white',
            }}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
