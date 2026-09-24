"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const { data, error } = await createClient().auth.signUp({ email: String(form.get("email")), password: String(form.get("password")), options: { data: { full_name: String(form.get("fullName")) } } });
      if (error) {
        const normalized = error.message.toLowerCase();
        if (normalized.includes("already registered") || normalized.includes("already been registered")) setMessage("Email sudah terdaftar. Silakan masuk.");
        else if (normalized.includes("rate limit")) setMessage("Batas email Supabase tercapai. Jangan kirim ulang berkali-kali; tunggu sampai batas reset atau nonaktifkan Confirm email untuk development.");
        else if (normalized.includes("password") && normalized.includes("at least")) setMessage("Password belum memenuhi syarat minimum Supabase.");
        else if (normalized.includes("database error saving new user")) setMessage("Akun Auth gagal disimpan oleh database. Jalankan migration 001 lalu 002 di Supabase SQL Editor.");
        else setMessage(`Registrasi gagal: ${error.message}`);
      } else if (data.session) {
        window.location.href = "/dashboard";
        return;
      } else {
        setMessage("Akun dibuat, tetapi Supabase masih meminta konfirmasi email. Nonaktifkan Confirm email di Authentication > Providers > Email.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Konfigurasi aplikasi belum siap.");
    } finally {
      setPending(false);
    }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8 sm:px-6"><div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(7,87,72,0.08)] sm:p-8"><a href="/" className="text-sm font-bold text-[var(--brand)]">← AyoLapor</a><h1 className="mt-8 text-3xl font-bold text-[var(--brand-dark)] sm:text-4xl">Buat akun masyarakat</h1><p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">Gunakan akun ini untuk mengirim dan memantau laporan.</p><form onSubmit={submit} className="mt-8 space-y-4"><input required name="fullName" placeholder="Nama lengkap" className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base" /><input required name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base" /><input required minLength={8} name="password" type="password" placeholder="Kata sandi, minimal 8 karakter" className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base" /><button disabled={pending} className="w-full rounded-full bg-[var(--brand)] px-6 py-3 font-bold text-white disabled:opacity-50">{pending ? "Mendaftarkan..." : "Daftar"}</button>{message && <p className="text-sm text-[var(--ink-muted)]">{message}</p>}</form><a href="/login" className="mt-5 block text-center text-sm font-bold text-[var(--brand)]">Sudah punya akun? Masuk</a></div></main>;
}