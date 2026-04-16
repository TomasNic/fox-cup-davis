import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/cups",      label: "Copas" },
  { href: "/players",   label: "Jugadores" },
  { href: "/reglamento", label: "Reglamento" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-10">

        {/* Top: logo + nav */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="text-sm font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] hover:text-[#CC4E0D] transition-colors">
              Copa Davis Fox
            </Link>
            <p className="text-xs text-[#6B7280] mt-2 max-w-[200px]">
              Torneo de tenis entre amigos al estilo Copa Davis.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide mb-3">Sitio</p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-[#CC4E0D] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1C1917] uppercase tracking-wide mb-3">Más</p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin"
                    className="text-sm text-[#6B7280] hover:text-[#CC4E0D] transition-colors"
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/design-system"
                    className="text-sm text-[#6B7280] hover:text-[#CC4E0D] transition-colors"
                  >
                    Design system
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: copyright */}
        <div className="border-t border-[#F3F4F6] pt-6">
          <p className="text-xs text-[#6B7280]">
            © {year} Copa Davis Fox. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
