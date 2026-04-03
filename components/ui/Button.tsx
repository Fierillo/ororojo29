import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cobre text-white hover:bg-cobre-light hover:shadow-[0_0_30px_rgba(184,115,51,0.3)]",
    secondary: "bg-dark-card text-white border border-cobre hover:bg-cobre/10",
    outline: "border-2 border-cobre text-cobre-light hover:bg-cobre hover:text-white hover:shadow-[0_0_30px_rgba(184,115,51,0.3)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
}