"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type FormActionState = { error?: string; success?: string };

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(previousState: FormActionState, formData: FormData): Promise<FormActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (fullName.length < 2 || fullName.length > 80) return { ...previousState, error: "Nama harus terdiri dari 2 sampai 80 karakter.", success: "" };
  if (!email.includes("@") || email.length > 160) return { ...previousState, error: "Masukkan email yang valid.", success: "" };
  if (password && password.length < 8) return { ...previousState, error: "Password baru minimal 8 karakter.", success: "" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ...previousState, error: "Sesi login sudah berakhir.", success: "" };

  const emailChanged = email !== user.email?.toLowerCase();
  if (emailChanged) {
    try {
      const admin = createAdminClient();
      const adminUpdate: { email: string; email_confirm: true; password?: string; user_metadata: { full_name: string } } = { email, email_confirm: true, user_metadata: { full_name: fullName } };
      if (password) adminUpdate.password = password;
      const { error: adminError } = await admin.auth.admin.updateUserById(user.id, adminUpdate);
      if (adminError) return { ...previousState, error: `Email Auth gagal diperbarui: ${adminError.message}`, success: "" };
    } catch (error) {
      return { ...previousState, error: error instanceof Error ? error.message : "Service role Supabase belum dikonfigurasi.", success: "" };
    }
  } else {
    const authUpdate: { password?: string; data: { full_name: string } } = { data: { full_name: fullName } };
    if (password) authUpdate.password = password;
    const { error: authError } = await supabase.auth.updateUser(authUpdate);
    if (authError) return { ...previousState, error: `Auth gagal diperbarui: ${authError.message}`, success: "" };
  }

  const { error: profileError } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (profileError) return { ...previousState, error: "Profile gagal diperbarui.", success: "" };

  revalidatePath("/admin/dashboard");
  return { error: "", success: "Profile berhasil diperbarui." };
}