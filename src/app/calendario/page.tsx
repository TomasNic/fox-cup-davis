"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTH_SHORT = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarioPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = Math.max(1, selectedDay - 3);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = startDay + i;
    return d <= daysInMonth ? d : null;
  }).filter(Boolean) as number[];

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
    setSelectedDay(1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
    setSelectedDay(1);
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-6">
          Calendario
        </h1>

        {/* Month nav */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-md border border-[#E5E7EB] hover:border-[#CC4E0D] transition-colors">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-md border border-[#E5E7EB] hover:border-[#CC4E0D] transition-colors">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day strip */}
        <div className="flex gap-2 mb-8">
          {weekDays.map(day => {
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center gap-1 w-14 py-3 rounded-[10px] border transition-colors
                  ${isSelected
                    ? "bg-[#CC4E0D] border-[#CC4E0D] text-white"
                    : "bg-white border-[#E5E7EB] text-[#1C1917] hover:border-[#CC4E0D]"
                  }`}
              >
                <span className="text-xs font-medium">{MONTH_SHORT[month]}</span>
                <span className="text-lg font-bold font-[var(--font-oswald)]">{day}</span>
              </button>
            );
          })}
        </div>

        {/* Placeholder */}
        <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-3">
          Eventos del día
        </h2>
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-16 text-center">
          <p className="text-[#6B7280] text-sm">No hay eventos para este día.</p>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
