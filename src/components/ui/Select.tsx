import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({
  label, error, options, placeholder, className = "", id, ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#374151]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        {...props}
        className={`
          w-full px-3 py-2.5 rounded-md border-2 border-[#D1D5DB] bg-white
          text-sm text-[#1C1917]
          focus:outline-none focus:border-[#CC4E0D] focus:ring-2 focus:ring-[#CC4E0D]/20
          disabled:bg-[#F6F7F9] disabled:text-[#6B7280] disabled:cursor-not-allowed
          transition-colors
          ${error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/20" : ""}
          ${className}
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#B42318]">{error}</p>}
    </div>
  );
}
