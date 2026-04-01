"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/cups",      label: "Copas" },
  { href: "/players",   label: "Jugadores" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-10 h-20 flex items-center justify-between">
        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Copa Davis Fox" width={140} height={56} className="h-14 w-auto" />
          </Link>
          <nav className="flex items-center">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 h-20 flex items-center text-sm font-medium transition-colors
                    ${active
                      ? "text-[#CC4E0D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#CC4E0D] after:rounded-t"
                      : "text-[#6B7280] hover:text-[#1C1917]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar jugador, torneo o fecha..."
              className="pl-9 pr-4 py-2 text-sm bg-[#F6F7F9] border border-[#E5E7EB] rounded-md w-64 placeholder-[#6B7280] focus:outline-none focus:border-[#CC4E0D]"
            />
          </div>
          {/* Admin */}
          <Link
            href="/admin"
            title="Acceso admin"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#CC4E0D] hover:bg-[#F6F7F9] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
