export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3f4f1] text-[#0d3d37]">
      <header className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center md:px-10">
        <a href="/" className="text-[1.8rem] font-black tracking-[-0.06em] text-[#0d3d37] sm:text-[2rem]">
          AyoLapor<span className="text-[#e7a768]">.</span>
        </a>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:gap-3">
          <a
            href="/login"
            className="rounded-full px-4 py-2 text-[#0d3d37] transition hover:bg-white/60 hover:text-[#0d3d37]"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="rounded-full border border-[#cfe3db] bg-white/50 px-4 py-2 text-[#0d3d37] shadow-[0_10px_25px_rgba(13,61,55,0.06)] transition hover:-translate-y-0.5 hover:border-[#9ec7be] hover:bg-white"
          >
            Daftar masyarakat
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-4 md:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:pt-10">
        <div className="relative">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-[#0d7a68]">
            Suara warga, perubahan nyata
          </p>

          <h1 className="max-w-[620px] text-[2.8rem] font-black leading-[0.92] tracking-[-0.07em] text-[#0d3d37] sm:text-[4rem] md:text-[6.5rem]">
            <span className="block">Kota yang</span>
            <span className="block">lebih baik</span>
            <span className="block">dimulai dari</span>
            <span className="block">satu laporan.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#536d68] sm:text-lg sm:leading-8">
            Sampaikan masalah di lingkunganmu. Pantau prosesnya dengan transparan dan bantu
            pemerintah menentukan prioritas di setiap wilayah.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href="/lapor"
              className="rounded-full bg-[#0d7a68] px-6 py-3.5 text-base font-bold text-white shadow-[0_18px_45px_rgba(13,122,104,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-[#0a685b] sm:px-7"
            >
              Laporkan sekarang
            </a>
            <a
              href="/laporan"
              className="rounded-full border border-[#bdd7cf] bg-white/70 px-6 py-3.5 text-base font-bold text-[#0d3d37] transition duration-200 hover:-translate-y-1 hover:border-[#9ec7be] hover:bg-white sm:px-7"
            >
              Lihat laporan publik
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#2b4c46]">
            <div className="rounded-full border border-[#dfeae5] bg-white/70 px-3 py-2 backdrop-blur-sm">
              <span className="font-bold text-[#0d3d37]">1.8k+</span> laporan aktif
            </div>
            <div className="rounded-full border border-[#dfeae5] bg-white/70 px-3 py-2 backdrop-blur-sm">
              <span className="font-bold text-[#0d3d37]">96%</span> respon cepat
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="hero-card float-slow relative w-full max-w-[520px] overflow-hidden rounded-[2.2rem] border border-[#dceae3] bg-[#d8e7df] p-6 shadow-[0_30px_80px_rgba(27,87,74,0.12)] md:p-7">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#f1c38a] opacity-85" />
            <div className="absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-[#d7d5f7]/40 blur-2xl" />

            <div className="relative flex min-h-[360px] flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-16 w-16 rounded-full border border-[#b8d0c8] bg-white/20" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0d3d37]/10 bg-white/60 text-sm font-bold text-[#0d3d37]">
                  ✓
                </div>
              </div>

              <div className="relative z-10 ml-4 pt-8">
                <div className="mb-5 flex items-center gap-3 text-[#0d3d37]">
                  <div className="h-px w-12 bg-[#0d3d37]/35" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0d3d37]/70">
                    Aksi cepat
                  </span>
                </div>

                <div className="text-[4rem] font-black leading-none tracking-[-0.08em] text-[#0d3d37] md:text-[4.5rem]">
                  24 jam
                </div>
                <p className="mt-3 max-w-[280px] text-base leading-7 text-[#44635d]">
                  rata-rata waktu laporan dibaca oleh petugas.
                </p>
              </div>

              <div className="relative z-10 mt-6 rounded-[1.5rem] border border-[#bcd5cb] bg-white/40 p-4 backdrop-blur-sm">
                <p className="text-sm leading-6 text-[#40615c]">
                  Terhubung dengan warga dan petugas di satu ruang.
                </p>
              </div>
            </div>

            <div className="float-delay absolute -left-1 top-20 hidden rounded-full border border-[#0d7a68]/20 bg-white/75 px-3 py-2 text-xs font-bold text-[#0d3d37] shadow-sm md:flex">
              234 laporan hari ini
            </div>

            <div className="float-delay-2 absolute -right-3 bottom-16 hidden rounded-full border border-[#0d7a68]/20 bg-[#f5efe7] px-3 py-2 text-xs font-bold text-[#0d3d37] shadow-sm md:flex">
              Petugas aktif
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
