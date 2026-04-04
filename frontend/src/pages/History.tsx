import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

type HistorySession = {
  id: string
  title: string
  date: string
  score: number
  status: string
  summary: string
}

const sessions: HistorySession[] = [
  {
    id: "session-1",
    title: "Frontend Developer Interview",
    date: "14 Maret 2026",
    score: 84,
    status: "Selesai",
    summary:
      "Jawaban sudah cukup terstruktur dengan area peningkatan pada contoh konkret.",
  },
  {
    id: "session-2",
    title: "Product Analyst Interview",
    date: "12 Maret 2026",
    score: 80,
    status: "Selesai",
    summary:
      "Motivasi dan alur jawaban cukup baik, namun masih bisa lebih spesifik.",
  },
  {
    id: "session-3",
    title: "Backend Engineer Interview",
    date: "9 Maret 2026",
    score: 88,
    status: "Selesai",
    summary: "Penyampaian cukup stabil dan key points sudah tersampaikan dengan baik.",
  },
]

function History() {
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
        <section className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
            Riwayat Sesi
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Tinjau sesi latihan yang pernah dilakukan
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
            Buka salah satu sesi di bawah untuk melihat ringkasan skor, evaluasi, dan detail jawaban per pertanyaan.
          </p>
          <div className="mt-8">
            <Link
              to="/session/setup"
              className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] shadow-sm transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
            >
              Mulai Sesi Baru
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 px-1">
            <h2 className="text-xl font-semibold tracking-tight text-[#0F172A]">
              Daftar sesi
            </h2>
          </div>

          <ul className="flex flex-col gap-4">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  to={`/results/${session.id}`}
                  className="group block rounded-[28px] border border-[#E2E8F0] bg-white/90 p-6 shadow-sm backdrop-blur transition hover:border-[#CBD5E1] hover:shadow-md lg:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#0F172A] transition group-hover:text-[#0F172A] sm:text-xl">
                          {session.title}
                        </h3>
                        <span className="inline-flex shrink-0 rounded-full border border-[#E8D9A0] bg-[#FAF6E8] px-2.5 py-0.5 text-xs font-medium text-[#7C6312]">
                          {session.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#64748B]">{session.date}</p>
                      <p className="mt-3 text-sm leading-7 text-[#475569]">{session.summary}</p>
                    </div>
                    <div className="flex shrink-0 flex-row items-baseline gap-2 sm:flex-col sm:items-end sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                        Skor
                      </p>
                      <p className="text-3xl font-semibold tabular-nums text-[#0F172A] sm:text-4xl">
                        {session.score}
                        <span className="text-lg font-medium text-[#64748B]">/100</span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-[#C9A227] transition group-hover:text-[#7C6312]">
                    Lihat detail hasil →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default History
