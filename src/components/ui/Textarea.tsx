import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-[#374151]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-describedby={errorId}
        {...props}
        className={`
          w-full px-3 py-2.5 rounded-md border-2 border-[#D1D5DB] bg-white
          text-sm text-[#1C1917] placeholder:text-[#9CA3AF]
          focus:outline-none focus:border-[#CC4E0D] focus:ring-2 focus:ring-[#CC4E0D]/20
          disabled:bg-[#F6F7F9] disabled:cursor-not-allowed
          resize-none transition-colors
          ${error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/20" : ""}
          ${className}
        `}
      />
      {error && <p id={errorId} className="text-xs text-[#B42318]">{error}</p>}
    </div>
  );
}
