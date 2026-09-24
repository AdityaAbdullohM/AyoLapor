"use client";

import { useActionState, useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { createReportResponse } from "@/app/actions/reports";
import { SuccessAlert } from "@/components/success-alert";

const initialState = { error: "", success: "" };

export function ReportResponseForm({ reportId }: { reportId: string }) {
  const [state, action, pending] = useActionState(createReportResponse, initialState);
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => { if (state.success) setShowSuccess(true); }, [state.success]);
  return <><form action={action} className="mt-5 space-y-3"><input type="hidden" name="reportId" value={reportId} /><label htmlFor="message" className="flex items-center gap-2 text-sm font-bold text-slate-700"><MessageSquare size={16} className="text-emerald-600" aria-hidden="true" />Balasan resmi</label><textarea id="message" name="message" required minLength={5} maxLength={2000} rows={4} placeholder="Tulis tindak lanjut atau informasi untuk warga..." className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />{state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}<button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">{pending ? "Mengirim..." : "Kirim balasan"}<Send size={15} aria-hidden="true" /></button></form>{showSuccess && <SuccessAlert title="Balasan terkirim!" message="Balasan resmi sudah ditambahkan ke laporan ini." onConfirm={() => { setShowSuccess(false); window.location.reload(); }} />}</>;
}