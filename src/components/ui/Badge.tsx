import type { PlayerCategory, CupStatus } from "@/types";

// --- Category Badge ---
const categoryColors: Record<PlayerCategory, string> = {
  A: "bg-[#CC4E0D]/10 text-[#CC4E0D]",
  B: "bg-orange-100 text-orange-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-blue-100 text-blue-700",
  E: "bg-[#E5E7EB] text-[#6B7280]",
};

export function CategoryBadge({ category }: { category: PlayerCategory }) {
  return (
    <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[category]}`}>
      Cat. {category}
    </span>
  );
}

// --- Status Badge ---
const statusConfig: Record<CupStatus, { label: string; cls: string }> = {
  upcoming:    { label: "Próximamente", cls: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En curso",     cls: "bg-orange-100 text-orange-700" },
  completed:   { label: "Finalizada",   cls: "bg-green-100 text-green-700" },
};

export function StatusBadge({ status }: { status: CupStatus }) {
  const { label, cls } = statusConfig[status];
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

// --- Result Badge ---
type Result = "won" | "lost" | "draw" | "pending";

const resultConfig: Record<Result, { label: string; cls: string }> = {
  won:     { label: "Ganó",      cls: "bg-green-100 text-green-700" },
  lost:    { label: "Perdió",    cls: "bg-red-100 text-red-700" },
  draw:    { label: "Empate",    cls: "bg-gray-100 text-gray-600" },
  pending: { label: "Pendiente", cls: "bg-blue-100 text-blue-600" },
};

export function ResultBadge({ result }: { result: Result }) {
  const { label, cls } = resultConfig[result];
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}
