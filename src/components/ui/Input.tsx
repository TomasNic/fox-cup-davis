import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#374151]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-describedby={errorId}
        {...props}
        className={`
          w-full px-3 py-2.5 rounded-md border-2 border-[#D1D5DB] bg-white
          text-sm text-[#1C1917] placeholder:text-[#9CA3AF]
          focus:outline-none focus:border-[#CC4E0D] focus:ring-2 focus:ring-[#CC4E0D]/20
          disabled:bg-[#F6F7F9] disabled:text-[#6B7280] disabled:cursor-not-allowed
          transition-colors
          ${error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/20" : ""}
          ${className}
        `}
      />
      {error && <p id={errorId} className="text-xs text-[#B42318]">{error}</p>}
    </div>
  );
}
