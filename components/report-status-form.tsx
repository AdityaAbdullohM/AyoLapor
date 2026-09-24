"use client";

import { FormEvent, useState } from "react";
import { updateReportStatus } from "@/app/actions/reports";
import { SuccessAlert } from "@/components/success-alert";
import type { ReportStatus } from "@/types/database";

export function ReportStatusForm({ reportId, status }: { reportId: string; status: ReportStatus }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  if (status === "selesai") return null;

  const nextStatus = status === "pending" ? "diproses" : "selesai";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await updateReportStatus(reportId, nextStatus, new FormData(event.currentTarget));
    if (result.error) setError(result.error);
    else setShowSuccess(true);
    setPending(false);
  }

  return <><form onSubmit={submit} className="flex-1"><button disabled={pending} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50">{pending ? "Memproses..." : status === "pending" ? "Mulai proses" : "Tandai selesai"}</button></form>{error && <p className="col-span-full text-sm text-red-700">{error}</p>}{showSuccess && <SuccessAlert title="Status diperbarui!" message={`Laporan berhasil diubah menjadi ${nextStatus}.`} onConfirm={() => window.location.reload()} />}</>;
}