import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportForm } from "@/components/report-form";

export default async function LaporPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lapor");

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans text-slate-800 sm:px-6 md:px-8 md:py-10"><div className="mx-auto max-w-3xl"><a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-transform hover:-translate-x-1 hover:text-emerald-700"><ArrowLeft size={16} aria-hidden="true" />AyoLapor</a><header className="mb-8 mt-8 sm:mt-10"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-700 sm:text-xs">Form pengaduan</p><h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl md:text-4xl">Apa yang terjadi?</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">Ceritakan masalah di lingkunganmu secara lengkap agar petugas dapat menindaklanjutinya dengan tepat.</p></header><ReportForm categories={categories ?? []} /></div></main>;
}