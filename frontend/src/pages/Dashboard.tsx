import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

type RecentSession = {
  title: string
  date: string
  status: string
  score: string
}

const recentSessions: RecentSession[] = [
  {
    title: "Frontend Developer Interview",
    date: "14 Maret 2026",
    status: "Selesai",
    score: "86",
  },
  {
    title: "Product Analyst Interview",
    date: "12 Maret 2026",
    status: "Selesai",
    score: "81",
  },
  {
    title: "Backend Engineer Interview",
    date: "9 Maret 2026",
    status: "Selesai",
    score: "88",
  },
]

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-14rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#C9A227]/12 blur-3xl" />
        <div className="absolute right-[-12rem] top-[4rem] h-[42rem] w-[42rem] rounded-full bg-[#0F172A]/8 blur-3xl" />
        <div className="absolute bottom-[8rem] left-[10%] h-[34rem] w-[34rem] rounded-full bg-[#334155]/8 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[8%] h-[36rem] w-[36rem] rounded-full bg-[#C9A227]/10 blur-3xl" />
      </div>

      <Navbar navItems={dashboardNavItems} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section
          id="selamat-datang"
          className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
            Dashboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Selamat datang kembali
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
            Lanjutkan latihan wawancara atau tinjau riwayat sesi latihanmu.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/session/setup"
              className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Mulai Sesi
            </Link>
            <Link
              to="/history"
              className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
            >
              Lihat Riwayat
            </Link>
          </div>
        </section>

        <section
          id="riwayat-sesi"
          className="mt-10 rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
                Riwayat
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
                Sesi terkini
              </h2>
              <p className="mt-2 text-sm text-[#475569]">
                Daftar singkat sesi mock untuk pratinjau antarmuka.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-medium">Judul sesi</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Skor</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr
                    key={session.title}
                    className="border-b border-[#E2E8F0] last:border-0 bg-white transition hover:bg-[#F8FAFC]/80"
                  >
                    <td className="px-4 py-4 font-medium text-[#0F172A]">{session.title}</td>
                    <td className="hidden px-4 py-4 text-[#475569] sm:table-cell">
                      {session.date}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-[#E8D9A0] bg-[#FAF6E8] px-2.5 py-0.5 text-xs font-medium text-[#7C6312]">
                        {session.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#0F172A]">
                      {session.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default Dashboard
