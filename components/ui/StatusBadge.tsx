import React from "react";

type StatusType = "active" | "pending" | "completed";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    active: {
      label: "En Proceso",
      className: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
    },
    pending: {
      label: "Pendiente",
      className: "bg-[#48c1d2]/10 text-[#48c1d2] border-[#48c1d2]/20",
      dot: "bg-[#48c1d2]",
    },
    completed: {
      label: "Completado",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${current.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} aria-hidden="true" />
      {current.label}
    </span>
  );
}
