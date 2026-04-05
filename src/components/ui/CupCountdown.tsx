"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  /    60_000),
    seconds: Math.floor((diff % 60_000)     /     1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface CupCountdownProps {
  /** ISO date string de la copa (e.g. "2026-04-15") */
  date: string;
}

export default function CupCountdown({ date }: CupCountdownProps) {
  const target = new Date(date + "T00:00:00");
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Primer cálculo en el cliente (evita mismatch de hidratación)
    setTimeLeft(calculate(target));
    const id = setInterval(() => setTimeLeft(calculate(target)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (timeLeft === null) return null; // ya pasó o hidratando

  const units = [
    { value: timeLeft.days,    label: "días" },
    { value: timeLeft.hours,   label: "hs"   },
    { value: timeLeft.minutes, label: "min"  },
    { value: timeLeft.seconds, label: "seg"  },
  ];

  return (
    <div className="mt-4">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Faltan</p>
      <div className="flex items-end gap-2">
        {units.map(({ value, label }, i) => (
          <div key={label} className="flex items-end gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold font-[var(--font-oswald)] text-[#CC4E0D] tabular-nums leading-none">
                {pad(value)}
              </span>
              <span className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wide mt-0.5">
                {label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-[#D1D5DB] font-bold text-lg leading-none mb-3">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
