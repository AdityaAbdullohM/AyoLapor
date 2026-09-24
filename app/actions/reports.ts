"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ReportStatus } from "@/types/database";

const reportSchema = z.object({ title: z.string().trim().min(5).max(120), description: z.string().trim().min(20), categoryId: z.string().uuid(), address: z.string().trim().min(5).max(240) });

export async function createReport(_previousState: { error: string; success: string }, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Silakan masuk terlebih dahulu." };
  const parsed = reportSchema.safeParse({ title: formData.get("title"), description: formData.get("description"), categoryId: formData.get("categoryId"), address: formData.get("address") });
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    if (fields.categoryId) return { error: "Pilih kategori laporan yang tersedia." };
    if (fields.title) return { error: "Judul laporan harus 5 sampai 120 karakter." };
    if (fields.description) return { error: "Deskripsi laporan harus minimal 20 karakter." };
    if (fields.address) return { error: "Alamat atau lokasi harus minimal 5 karakter." };
    return { error: "Lengkapi semua data laporan dengan benar." };
  }
  const file = formData.get("image");
  let imagePath: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) return { error: "Lampiran harus berupa gambar maksimal 5 MB." };
    imagePath = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from("report-attachments").upload(imagePath, file, { contentType: file.type, upsert: false });
    if (upload.error) return { error: "Lampiran gagal diunggah." };
  }
  const { error } = await supabase.from("reports").insert({ user_id: user.id, category_id: parsed.data.categoryId, title: parsed.data.title, description: parsed.data.description, address: parsed.data.address, image_path: imagePath });
  if (error) return { error: `Laporan gagal disimpan: ${error.message}` };
  revalidatePath("/lapor");
  revalidatePath("/admin/dashboard");
  return { success: "Laporan berhasil dikirim." };
}

export async function updateReportStatus(reportId: string, status: ReportStatus, response?: string | FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !["pending", "diproses", "selesai", "ditolak"].includes(status)) return { error: "Akses ditolak." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "petugas"].includes(profile.role)) return { error: "Akses ditolak." };
  const update = await supabase.from("reports").update({ status }).eq("id", reportId);
  if (update.error) return { error: "Status gagal diperbarui." };
  const responseText = typeof response === "string" ? response.trim() : response instanceof FormData ? String(response.get("response") ?? "").trim() : "";
  if (responseText) await supabase.from("report_responses").insert({ report_id: reportId, responder_id: user.id, message: responseText });
  revalidatePath("/admin/dashboard");
  revalidatePath("/laporan");
  return { success: "Laporan diperbarui." };
}

export async function createReportResponse(_previousState: { error: string; success: string }, formData: FormData) {
  const reportId = String(formData.get("reportId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!reportId || message.length < 5 || message.length > 2000) return { error: "Balasan harus terdiri dari 5 sampai 2.000 karakter.", success: "" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi login sudah berakhir.", success: "" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "petugas"].includes(profile.role)) return { error: "Akses ditolak.", success: "" };

  const { error } = await supabase.from("report_responses").insert({ report_id: reportId, responder_id: user.id, message });
  if (error) return { error: `Balasan gagal disimpan: ${error.message}`, success: "" };
  revalidatePath(`/admin/dashboard/laporan/${reportId}`);
  return { error: "", success: "Balasan berhasil dikirim." };
}