import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-forest-600 text-white hover:bg-forest-700 active:bg-forest-800 disabled:bg-stone-300",
  secondary:
    "bg-cream-100 text-forest-700 hover:bg-cream-100/70 active:bg-cream-200",
  ghost: "bg-transparent text-forest-700 hover:bg-cream-50 active:bg-cream-100",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`min-h-[44px] min-w-[44px] rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
