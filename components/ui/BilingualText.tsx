import React from "react";

interface BilingualTextProps {
  en?: string;
  es: string;
  enStyle?: "default" | "primary" | "title";
  esStyle?: "default" | "muted" | "small";
  className?: string;
  showBoth?: boolean;
}

export function BilingualText({
  en,
  es,
  enStyle = "default",
  esStyle = "muted",
  className = "",
  showBoth = false,
}: BilingualTextProps) {
  const primaryStyles = {
    default: "text-[var(--text-main)]",
    primary: "text-[var(--primary)] font-semibold",
    title: "text-[var(--primary)] font-bold text-lg",
  };

  const secondaryStyles = {
    default: "text-[var(--text-main)]",
    muted: "text-[var(--text-muted)] text-sm",
    small: "text-[var(--text-muted)] text-xs italic",
  };

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {showBoth && en ? (
        <>
          <span className={primaryStyles[enStyle]}>{en}</span>
          <span className={secondaryStyles[esStyle]}>{es}</span>
        </>
      ) : (
        <span className={primaryStyles[enStyle]}>{es}</span>
      )}
    </div>
  );
}
