import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseConfig, supabaseConfigMessage } from "@/lib/supabase/config";

export function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error(supabaseConfigMessage);
  return createBrowserClient<Database>(config.url, config.anonKey);
}