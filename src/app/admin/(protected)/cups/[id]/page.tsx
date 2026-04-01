import { notFound } from "next/navigation";
import { getCupWithDetails, getPlayers } from "@/lib/supabase/queries";
import CupAdminClient from "./CupAdminClient";

export default async function AdminCupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cup, allPlayers] = await Promise.all([getCupWithDetails(id), getPlayers()]);
  if (!cup) notFound();
  return <CupAdminClient cup={cup} allPlayers={allPlayers} />;
}
