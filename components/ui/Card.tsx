import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function Card({ children, padding = "md", className = "", onClick, ...props }: CardProps) {
  const paddingMap = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-5",
    lg: "p-6 sm:p-8",
  };

  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-[var(--surface)] card-shadow border border-[var(--border)] overflow-hidden
        ${isClickable ? "cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0" : ""}
        ${paddingMap[padding]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
