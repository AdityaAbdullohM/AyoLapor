"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { AlignLeft, CheckCircle2, FileText, ImageIcon, MapPin, Send, Tag, UploadCloud } from "lucide-react";
import { createReport } from "@/app/actions/reports";

type Category = { id: string; name: string };
const initialState = { error: "", success: "" };

export function ReportForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(createReport, initialState);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) setShowSuccess(true);
  }, [state.success]);

  function goToDashboard() {
    window.location.href = "/dashboard";
  }

  function selectFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setFileError("");
    setFileName(file.name);
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = transfer.files;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files[0]);
  }

  return <>
  <form action={action} className="space-y-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/50 sm:p-6 md:p-8">
    <div><label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800" htmlFor="title"><FileText size={16} className="text-emerald-600" aria-hidden="true" />Judul laporan</label><input id="title" name="title" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="Contoh: Lampu jalan mati di Jalan Melati" /></div>
    <div><label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800" htmlFor="categoryId"><Tag size={16} className="text-emerald-600" aria-hidden="true" />Kategori</label><select id="categoryId" name="categoryId" required disabled={categories.length === 0} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"><option value="">{categories.length === 0 ? "Kategori belum tersedia" : "Pilih kategori"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{categories.length === 0 && <p className="mt-2 text-sm text-amber-700">Kategori belum tersedia di database. Jalankan seed kategori Supabase terlebih dahulu.</p>}</div>
    <div><label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800" htmlFor="description"><AlignLeft size={16} className="text-emerald-600" aria-hidden="true" />Ceritakan masalahnya</label><textarea id="description" name="description" required minLength={20} rows={5} className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="Jelaskan kondisi, dampak, dan waktu kejadian..." /></div>
    <div><label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800" htmlFor="address"><MapPin size={16} className="text-emerald-600" aria-hidden="true" />Alamat atau lokasi</label><input id="address" name="address" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="Nama jalan, kelurahan, atau patokan" /></div>
    <div><p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><ImageIcon size={16} className="text-emerald-600" aria-hidden="true" />Foto pendukung <span className="font-normal text-slate-500">(opsional)</span></p><label htmlFor="image" onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors sm:px-5 sm:py-7 ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-slate-100"}`}><input ref={fileInputRef} id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" /><UploadCloud size={30} className="text-emerald-600" aria-hidden="true" /><span className="mt-3 text-sm font-bold text-slate-700">{fileName || "Klik untuk mengunggah gambar"}</span><span className="mt-1 text-xs text-slate-500">atau tarik dan lepas di sini · Maksimal 5 MB</span></label>{fileError && <p className="mt-2 text-sm text-red-700">{fileError}</p>}</div>
    {state.error && <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
    {state.success && <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.success}</p>}
    <button disabled={pending || Boolean(fileError) || categories.length === 0} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Mengirim laporan..." : "Kirim laporan"}<Send size={17} aria-hidden="true" /></button>
  </form>
  {showSuccess && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-sm" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="report-success-title" className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={36} aria-hidden="true" /></div><h2 id="report-success-title" className="mt-5 text-2xl font-extrabold text-slate-800">Laporan terkirim!</h2><p className="mt-2 text-sm leading-6 text-slate-500">Laporanmu sudah tersimpan dan akan segera ditinjau oleh petugas.</p><button type="button" onClick={goToDashboard} className="mt-6 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 hover:shadow-lg">Kembali ke dashboard</button></section></div>}
  </>;
}