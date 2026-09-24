import { redirect } from "next/navigation";
import { Activity, ArrowUpRight, CheckCircle2, Clock3, Inbox, LogOut, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { ReportStatusForm } from "@/components/report-status-form";
import { LogoutButton } from "@/components/logout-button";

const statStyles = {
  pending: {
    label: "Pending",
    icon: Clock3,
    card: "border-amber-200 bg-amber-50/80",
    iconBox: "bg-amber-100 text-amber-600",
    number: "text-amber-600",
  },
  diproses: {
    label: "Diproses",
    icon: Activity,
    card: "border-blue-200 bg-blue-50/80",
    iconBox: "bg-blue-100 text-blue-600",
    number: "text-blue-600",
  },
  selesai: {
    label: "Selesai",
    icon: CheckCircle2,
    card: "border-emerald-200 bg-emerald-50/80",
    iconBox: "bg-emerald-100 text-emerald-600",
    number: "text-emerald-600",
  },
} as const;

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AP";
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/dashboard");

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  if (!profile || !["admin", "petugas"].includes(profile.role)) redirect("/");

  const { data: reports } = await supabase.from("reports").select("id, title, status, address, created_at, categories(name)").order("created_at", { ascending: false });
  const rows = reports ?? [];
  const displayName = profile.full_name ?? "Petugas";
  const statCards = Object.entries(statStyles).map(([status, style]) => ({ ...style, status, count: rows.filter((report) => report.status === status).length }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 font-sans text-slate-800 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Ruang petugas</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">Selamat datang, {displayName}.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Pantau laporan warga dan bantu menggerakkan perubahan di lingkungan sekitar.</p>
          </div>
          <div className="flex w-full flex-col items-stretch justify-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:w-auto sm:flex-row sm:items-center">
            <ProfileForm fullName={profile.full_name ?? ""} email={user.email ?? ""} />
            <LogoutButton />
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-extrabold text-emerald-700">{getInitials(displayName)}</div>
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Profile saya</p><h2 className="mt-1 truncate text-xl font-bold text-slate-800">{displayName}</h2><p className="mt-1 truncate text-sm text-slate-500">{user.email}</p></div>
            <div className="sm:ml-auto"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700">{profile.role}</span></div>
          </div>
        </section>

        <section aria-label="Ringkasan laporan" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return <div key={stat.status} className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${stat.card}`}><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-600">{stat.label}</p><p className={`mt-4 text-4xl font-extrabold ${stat.number}`}>{stat.count}</p><p className="mt-1 text-xs text-slate-500">laporan tercatat</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBox}`}><Icon size={22} aria-hidden="true" /></div></div></div>;
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"><div><h2 className="text-lg font-bold text-slate-800">Laporan terbaru</h2><p className="mt-1 text-sm text-slate-500">Kelola laporan warga yang masuk.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{rows.length} total</span></div>
          <div className="divide-y divide-slate-100">
            {rows.map((report) => <div key={report.id} className="grid gap-4 px-6 py-5 transition hover:bg-slate-50 md:grid-cols-[1fr_160px_320px] md:items-center"><div><p className="font-bold text-slate-800">{report.title}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} aria-hidden="true" />{report.address} · {report.categories?.name ?? "Tanpa kategori"}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-600">{report.status}</span><div className="flex flex-wrap gap-2"><a href={`/admin/dashboard/laporan/${report.id}`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Detail <ArrowUpRight size={15} aria-hidden="true" /></a><ReportStatusForm reportId={report.id} status={report.status} /></div></div>)}
            {rows.length === 0 && <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Inbox size={30} aria-hidden="true" /></div><h3 className="mt-5 text-base font-bold text-slate-700">Belum ada laporan</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Laporan warga yang baru masuk akan tampil di sini untuk segera ditindaklanjuti.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}