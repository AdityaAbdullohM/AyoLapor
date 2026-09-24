import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME || "Administrator AyoLapor";

if (!url || !serviceRoleKey || !email) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL first.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) { console.error(listError.message); process.exit(1); }
let user = users.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  if (!password || password.length < 8) {
    console.error("For a new admin account, also set ADMIN_PASSWORD with at least 8 characters.");
    process.exit(1);
  }
  const { data: created, error: createError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName } });
  if (createError) { console.error(createError.message); process.exit(1); }
  user = created.user;
}

const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, full_name: user.user_metadata?.full_name || fullName, role: "admin" });
if (profileError) { console.error(profileError.message); process.exit(1); }
console.log(`Admin account ready: ${email}`);