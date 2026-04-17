import React from "react";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "accent" | "success";
}

export function ProgressBar({
  progress,
  label,
  showValue = true,
  color = "accent",
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const colors = {
    primary: "bg-[var(--primary)]",
    accent: "bg-[var(--accent)]",
    success: "bg-[var(--success)]",
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between text-xs font-medium">
          {label && <span className="text-[var(--text-muted)]">{label}</span>}
          {showValue && <span className="text-[var(--primary)]">{clampedProgress}%</span>}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg)]">
        <div
          className={`h-full rounded-full ${colors[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
