import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-sarnami-100 bg-white p-6 shadow-sm ${className}`}
      {...props}
    />
  );
}
