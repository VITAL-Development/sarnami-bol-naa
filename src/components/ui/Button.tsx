import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-sarnami-600 text-white hover:bg-sarnami-700 disabled:bg-stone-300",
  secondary: "bg-sarnami-100 text-sarnami-700 hover:bg-sarnami-100/70",
  ghost: "bg-transparent text-sarnami-700 hover:bg-sarnami-50",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
