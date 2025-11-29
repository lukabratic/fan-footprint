import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  className?: string;
};

export function Button({ variant = "default", className = "", children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition";
  const variants: Record<string, string> = {
    default: "bg-neutral-800 text-neutral-100 hover:bg-neutral-700",
    outline: "bg-transparent border border-neutral-700 text-neutral-100 hover:bg-neutral-800/40",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
