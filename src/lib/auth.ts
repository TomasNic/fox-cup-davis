import { cookies } from "next/headers";

const COOKIE_NAME = "cdx_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 horas

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  if (username !== "admin" || password !== process.env.ADMIN_PASSWORD) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "1";
}
