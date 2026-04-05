"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: (active: boolean) => (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
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
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
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
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
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

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">

        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Copa Davis Fox" width={140} height={56} className="h-11 md:h-14 w-auto" />
          </Link>
          <nav className="max-md:hidden flex items-center">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 h-[72px] flex items-center gap-1.5 text-sm font-medium transition-colors
                    ${active
                      ? "text-[#CC4E0D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#CC4E0D] after:rounded-t"
                      : "text-[#6B7280] hover:text-[#1C1917]"
                    }`}
                >
                  {link.icon(active)}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin */}
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:text-[#CC4E0D] hover:border-[#CC4E0D]/40 hover:bg-[#FFF7F2] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
