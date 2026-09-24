export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes("your-project-ref") || anonKey === "your-anon-key") return null;
  return { url, anonKey };
}

export const supabaseConfigMessage = "Supabase belum dikonfigurasi. Salin .env.example menjadi .env.local, lalu isi URL project dan anon key dari Supabase Dashboard.";