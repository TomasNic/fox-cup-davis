import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary: "bg-[#CC4E0D] text-white font-semibold hover:bg-[#b34409] active:bg-[#9a3a08] focus-visible:ring-[#CC4E0D]",
  ghost:   "text-[#6B7280] hover:text-[#1C1917] focus-visible:ring-[#6B7280]/40",
  danger:  "text-[#B42318] hover:text-[#8b1c13] focus-visible:ring-[#B42318]/40",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded",
  md: "px-5 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3 text-sm rounded-md",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center transition-colors cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
