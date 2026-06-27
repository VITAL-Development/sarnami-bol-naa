import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, variant = "success", onDismiss, durationMs = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl px-5 py-3 font-semibold text-white shadow-lg ${
        variant === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
