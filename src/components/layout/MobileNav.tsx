"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z"
          fill={active ? "currentColor" : "none"}
          stroke={active ? "none" : "currentColor"}
          strokeWidth={2}
        />
        <path d="M9 22V12h6v10" stroke={active ? "white" : "currentColor"} strokeWidth={2} />
      </svg>
    ),
  },
  {
    href: "/cups",
    label: "Copas",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path
          d="M6 2h12l1 6c0 3.31-2.69 6-6 6H11C7.69 14 5 11.31 5 8L6 2z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
        />
        <path d="M12 14v4M8 22h8" stroke="currentColor" />
      </svg>
    ),
  },
  {
    href: "/players",
    label: "Jugadores",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <circle cx="9" cy="7" r="4" fill={active ? "currentColor" : "none"} stroke="currentColor" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" />
      </svg>
    ),
  },
  {
    href: "/reglamento",
    label: "Reglamento",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path
          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
        />
        <path d="M13 2v7h7" stroke="currentColor" />
        <path d="M9 12h6M9 16h6" stroke={active ? "white" : "currentColor"} />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex items-center gap-1 bg-white rounded-full px-2 py-2 shadow-lg border border-[#E5E7EB]">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-full transition-colors text-[10px] font-medium
                ${active ? "bg-[#CC4E0D] text-white" : "text-[#6B7280]"}`}
            >
              {link.icon(active)}
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
