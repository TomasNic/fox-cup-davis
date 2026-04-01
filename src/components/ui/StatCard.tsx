interface StatCardProps {
  value: string | number;
  label: string;
  accent?: boolean;
  className?: string;
}

export default function StatCard({ value, label, accent = false, className = "" }: StatCardProps) {
  if (accent) {
    return (
      <div className={`bg-[#CC4E0D] rounded-[10px] p-4 text-center ${className}`}>
        <p className="text-3xl font-bold font-[var(--font-oswald)] text-white">{value}</p>
        <p className="text-xs text-white/80 uppercase tracking-wide mt-1">{label}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-[10px] p-4 text-center ${className}`}>
      <p className="text-3xl font-bold font-[var(--font-oswald)] text-[#CC4E0D]">{value}</p>
      <p className="text-xs text-[#6B7280] uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}
