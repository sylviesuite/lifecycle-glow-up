import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  description?: string;
  className?: string;
}

export function ScoreBadge({ 
  label, 
  value, 
  maxValue, 
  unit = "",
  description,
  className 
}: ScoreBadgeProps) {
  const percentage = (value / maxValue) * 100;
  
  // Determine qualitative label
  const getQualitativeLabel = () => {
    if (percentage >= 70) return { text: "High", color: "var(--phase-prod)" };
    if (percentage >= 40) return { text: "Medium", color: "var(--phase-cons)" };
    return { text: "Low", color: "var(--phase-eol)" };
  };
  
  const qualitative = getQualitativeLabel();

  return (
    <div 
      className={cn("p-4 rounded-lg border", className)}
      style={{ 
        background: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'var(--ring-lifecycle)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ color: qualitative.color }}>
            {value.toFixed(0)}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-sub)' }}>
            / {maxValue}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-2" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`,
            background: qualitative.color
          }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span 
          className="text-xs font-semibold px-2 py-1 rounded"
          style={{ 
            background: qualitative.color + '20',
            color: qualitative.color
          }}
        >
          {qualitative.text}
        </span>
        {unit && (
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {unit}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs mt-2" style={{ color: 'var(--text-sub)' }}>
          {description}
        </p>
      )}
    </div>
  );
}
