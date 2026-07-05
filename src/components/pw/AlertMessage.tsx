import type { ReactNode } from "react";
import { color1, color2 } from "@/components/pw/colors";

type AlertMessageProps = {
  variant: "error" | "success" | "info";
  children: ReactNode;
  className?: string;
};

export default function AlertMessage({
  variant,
  children,
  className = "",
}: AlertMessageProps) {
  const baseClassName = `rounded-xl border px-4 py-3 text-sm ${className}`;

  if (variant === "success") {
    return (
      <p
        className={`${baseClassName} text-white/90`}
        style={{ borderColor: color1, backgroundColor: `${color1}18` }}
      >
        {children}
      </p>
    );
  }

  if (variant === "info") {
    return (
      <p
        className={`${baseClassName} text-white/90`}
        style={{ borderColor: color2, backgroundColor: `${color2}18` }}
      >
        {children}
      </p>
    );
  }

  return (
    <p
      className={`${baseClassName} border-red-400/40 bg-red-400/10 text-red-300`}
    >
      {children}
    </p>
  );
}
