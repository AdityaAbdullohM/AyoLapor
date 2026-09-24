"use client";

import { useActionState, useState } from "react";
import { KeyRound, Mail, UserRound, X } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";

const initialState = { error: "", success: "" };

export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateProfile, initialState);

  function closeDialog() {
    if (!pending) setOpen(false);
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)]">Edit profile</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--brand-dark)]/45 px-4 py-6 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" aria-describedby="profile-dialog-description" className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#fffdf9] shadow-[0_24px_80px_rgba(7,87,72,0.24)]">
        <header className="relative overflow-hidden bg-[var(--brand-dark)] px-6 py-6 text-white md:px-8">
          <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full border-[18px] border-[#e68c4a]/75" />
          <div className="relative flex items-start justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b9d9cb]">Pengaturan akun</p><h2 id="profile-dialog-title" className="mt-2 text-3xl font-bold tracking-tight">Edit profile</h2><p id="profile-dialog-description" className="mt-2 max-w-sm text-sm leading-6 text-[#d8ebe2]">Perbarui informasi akun yang digunakan untuk mengelola laporan.</p></div>
            <button type="button" onClick={closeDialog} aria-label="Tutup dialog" className="relative rounded-full p-2 text-[#d8ebe2] transition hover:bg-white/15 hover:text-white"><X size={20} /></button>
          </div>
        </header>
        <form action={action} className="space-y-5 px-6 py-6 md:px-8 md:py-7">
          <div>
            <label htmlFor="profile-full-name" className="mb-2 block text-sm font-bold text-[var(--brand-dark)]">Nama lengkap</label>
            <div className="relative"><UserRound size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" /><input id="profile-full-name" name="fullName" defaultValue={fullName} minLength={2} maxLength={80} required className="w-full rounded-xl border border-[var(--line)] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[#0d7a68]/10" placeholder="Nama lengkap" /></div>
          </div>
          <div>
            <label htmlFor="profile-email" className="mb-2 block text-sm font-bold text-[var(--brand-dark)]">Email</label>
            <div className="relative"><Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" /><input id="profile-email" name="email" type="email" defaultValue={email} required className="w-full rounded-xl border border-[var(--line)] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[#0d7a68]/10" placeholder="nama@email.com" /></div>
          </div>
          <div>
            <label htmlFor="profile-password" className="mb-2 block text-sm font-bold text-[var(--brand-dark)]">Password baru <span className="font-normal text-[var(--ink-muted)]">(opsional)</span></label>
            <div className="relative"><KeyRound size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" /><input id="profile-password" name="password" type="password" minLength={8} autoComplete="new-password" placeholder="Kosongkan jika tidak diubah" className="w-full rounded-xl border border-[var(--line)] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[#0d7a68]/10" /></div>
          </div>
          {state.error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{state.error}</p>}
          {state.success && <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">{state.success}</p>}
          <footer className="flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={closeDialog} className="rounded-xl px-5 py-3 text-sm font-bold text-[var(--ink-muted)] transition hover:bg-[#e8f2ed] hover:text-[var(--brand-dark)]">Batal</button><button disabled={pending} className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-wait disabled:opacity-50">{pending ? "Menyimpan..." : "Simpan perubahan"}</button></footer>
        </form>
      </section>
    </div>}
  </>;
}