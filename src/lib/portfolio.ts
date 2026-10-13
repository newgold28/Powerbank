import { isSupabaseConfigured } from "./supabase/server";
import type { PortfolioItem } from "@/content/portfolio";

/**
 * Loads portfolio items added by the owner through the dashboard.
 * Falls back to an empty list so the editable content file remains the
 * source of truth until the owner adds items in the admin area.
 */
export async function getDbPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load DB portfolio items", error.message);
      return [];
    }
    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row.id ?? Math.random()),
      src: String(row.src ?? ""),
      category: String(row.category ?? "Events"),
      title: String(row.title ?? ""),
      caption: String(row.caption ?? ""),
      location: String(row.location ?? ""),
      date: String(row.date ?? ""),
    }));
  } catch {
    return [];
  }
}