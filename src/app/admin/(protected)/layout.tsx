import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) redirect("/admin");

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#CC4E0D] rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">CDF</span>
              </div>
              <span className="text-sm font-bold text-[#1C1917]">Admin</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/players" className="text-[#6B7280] hover:text-[#CC4E0D] font-medium">Jugadores</Link>
              <Link href="/admin/cups"    className="text-[#6B7280] hover:text-[#CC4E0D] font-medium">Copas</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs text-[#6B7280] hover:text-[#CC4E0D]">← Ver sitio</Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-xs text-[#B42318] hover:underline">Cerrar sesión</button>
            </form>
          </div>
        </div>
      </header>
      <div className="max-w-[1440px] mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
