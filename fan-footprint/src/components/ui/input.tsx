import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 ${props.className ?? ""}`}
    />
  );
}
