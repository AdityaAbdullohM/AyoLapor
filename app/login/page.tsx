"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [canResend, setCanResend] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email"));
    setEmail(submittedEmail);
    setCanResend(false);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: submittedEmail, password: String(form.get("password")) });
      if (error || !data.user) {
        const unconfirmed = error?.code === "email_not_confirmed" || error?.message.toLowerCase().includes("email not confirmed");
        setMessage(unconfirmed ? "Email belum dikonfirmasi. Periksa inbox atau kirim ulang email konfirmasi." : "Email atau kata sandi tidak sesuai.");
        setCanResend(unconfirmed);
        setPending(false);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      window.location.href = profile?.role === "admin" || profile?.role === "petugas" ? "/admin/dashboard" : "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Konfigurasi aplikasi belum siap.");
      setPending(false);
    }
  }
  async function resendConfirmation() {
    const { error } = await createClient().auth.resend({ type: "signup", email });
    setMessage(error ? error.message : "Email konfirmasi sudah dikirim ulang.");
  }
  return <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8 sm:px-6"><div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(7,87,72,0.08)] sm:p-8"><a href="/" className="text-sm font-bold text-[var(--brand)]">← AyoLapor</a><h1 className="mt-8 text-3xl font-bold text-[var(--brand-dark)] sm:text-4xl">Masuk ke akun</h1><p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">Masyarakat dan petugas menggunakan halaman masuk yang sama.</p><form onSubmit={submit} className="mt-8 space-y-4"><input required name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base" /><input required name="password" type="password" placeholder="Kata sandi" className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base" /><button disabled={pending} className="w-full rounded-full bg-[var(--brand)] px-6 py-3 font-bold text-white disabled:opacity-50">{pending ? "Memeriksa..." : "Masuk"}</button>{message && <p className="text-sm text-red-700">{message}</p>}{canResend && <button type="button" onClick={resendConfirmation} className="w-full text-sm font-bold text-[var(--brand)]">Kirim ulang email konfirmasi</button>}</form><a href="/register" className="mt-5 block text-center text-sm font-bold text-[var(--brand)]">Belum punya akun masyarakat? Daftar</a></div></main>;
}