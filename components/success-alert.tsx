"use client";

import { CheckCircle2 } from "lucide-react";

export function SuccessAlert({ title, message, onConfirm }: { title: string; message: string; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-sm" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="success-alert-title" className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={36} aria-hidden="true" /></div><h2 id="success-alert-title" className="mt-5 text-2xl font-extrabold text-slate-800">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{message}</p><button type="button" onClick={onConfirm} className="mt-6 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 hover:shadow-lg">Lanjutkan</button></section></div>;
}