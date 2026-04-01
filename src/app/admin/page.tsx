"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 w-full max-w-sm shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#CC4E0D] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold font-[var(--font-oswald)]">CDF</span>
          </div>
        </div>
        <h1 className="text-xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-center text-[#1C1917] mb-6">
          Acceso Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#374151]">Usuario</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-md border-2 border-[#D1D5DB] bg-white text-[#1C1917] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#CC4E0D] focus:ring-2 focus:ring-[#CC4E0D]/20 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#374151]">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-md border-2 border-[#D1D5DB] bg-white text-[#1C1917] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#CC4E0D] focus:ring-2 focus:ring-[#CC4E0D]/20 transition-colors"
            />
          </div>
          {error && <p className="text-sm text-[#B42318] font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-[#CC4E0D] text-white text-sm font-semibold hover:bg-[#b34409] active:bg-[#9a3a08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC4E0D] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
