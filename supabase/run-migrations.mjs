// Script para ejecutar las migraciones en Supabase
// Ejecutar con: node supabase/run-migrations.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://znyqmbghimxjtboctqik.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueXFtYmdoaW14anRib2N0cWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDkxNDY0NCwiZXhwIjoyMDkwNDkwNjQ0fQ.NS3gPXEZxrpocU7OnV_1g5JcoaaUBjEmIyvVMDOCXpc";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Dividir SQL en statements individuales
function splitSQL(sql) {
  return sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));
}

async function execSQL(sql) {
  const { error } = await supabase.rpc("exec", { sql });
  if (error) throw error;
}

async function main() {
  console.log("🎾 Copa Davis Fox — Ejecutando migraciones...\n");

  // Leer archivos SQL
  const migration = readFileSync(join(__dirname, "migrations/002_cups_model.sql"), "utf8");
  const seed      = readFileSync(join(__dirname, "seed.sql"), "utf8");

  // Ejecutar via fetch directo a la API de Supabase con service_role
  const headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
  };

  console.log("📋 Ejecutando migration 002_cups_model.sql...");
  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: migration }),
  });

  // Usar pg-based approach via Supabase edge function no disponible
  // En su lugar, usar la URL de conexión directa
  console.log("\n⚠️  Este script requiere conexión directa a PostgreSQL.");
  console.log("   Por favor ejecutá el SQL manualmente en el SQL Editor de Supabase:");
  console.log("   https://supabase.com/dashboard/project/znyqmbghimxjtboctqik/sql\n");
  console.log("   Archivos a ejecutar (en orden):");
  console.log("   1. supabase/migrations/002_cups_model.sql");
  console.log("   2. supabase/seed.sql\n");
}

main().catch(console.error);
