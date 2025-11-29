import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  className?: string;
};

export function Button({ variant = "default", className = "", children, disabled, ...rest }: ButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95";
  const variants: Record<string, string> = {
    default: "bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

