import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getApiBaseUrl } from "../lib/apiBase"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

type HistorySession = {
  _id: string
  title: string
  jobRole: string
  companyName: string
  sourceType: string
  totalQuestions: number
  totalScore: number | null
  status: string
  createdAt: string
}

function History() {
  const [sessions, setSessions] = useState<HistorySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("vagmiai_auth_token")
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || "Gagal memuat riwayat.")
      setSessions(json.data ?? [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchHistory()
  }, [fetchHistory])

  function getStatusLabel(status: string) {
    switch (status) {
      case "active":
        return { label: "Belum Dimulai", color: "text-[#64748B] bg-[#F1F5F9] border-[#E2E8F0]" }
      case "processing":
        return { label: "Sedang Diproses", color: "text-[#7C6312] bg-[#FAF6E8] border-[#E8D9A0]" }
      case "completed":
        return { label: "Selesai", color: "text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]" }
      case "failed":
        return { label: "Gagal", color: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]" }
      default:
        return { label: status, color: "text-[#64748B] bg-[#F1F5F9] border-[#E2E8F0]" }
    }
  }

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
            Buka salah satu sesi di bawah untuk melihat ringkasan skor, evaluasi, dan detail
            jawaban per pertanyaan yang telah tersimpan di database.
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

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#C9A227]" />
              <p className="text-sm text-[#64748B]">Memuat riwayat sesi…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
              {error}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-[28px] border border-[#E2E8F0] bg-white/50 px-6 py-12 text-center backdrop-blur">
              <p className="text-[#64748B]">Anda belum memiliki riwayat sesi wawancara.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {sessions.map((session) => {
                const badge = getStatusLabel(session.status)
                const dateStr = new Date(session.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <li key={session._id}>
                    <Link
                      to={`/results/${session._id}`}
                      className="group block rounded-[28px] border border-[#E2E8F0] bg-white/90 p-6 shadow-sm backdrop-blur transition hover:border-[#CBD5E1] hover:shadow-md lg:p-8"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-[#0F172A] transition group-hover:text-[#0F172A] sm:text-xl">
                              {session.title}
                            </h3>
                            <span
                              className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.color}`}
                            >
                              {session.status === "processing" && (
                                <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-[#C9A227]" />
                              )}
                              {badge.label}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#64748B]">{dateStr}</p>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-7 text-[#475569]">
                            {session.jobRole && (
                              <p>
                                <span className="font-medium text-[#334155]">Posisi:</span>{" "}
                                {session.jobRole}
                              </p>
                            )}
                            {session.companyName && (
                              <p>
                                <span className="font-medium text-[#334155]">Perusahaan:</span>{" "}
                                {session.companyName}
                              </p>
                            )}
                            <p>
                              <span className="font-medium text-[#334155]">Pertanyaan:</span>{" "}
                              {session.totalQuestions}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-row items-baseline gap-2 sm:flex-col sm:items-end sm:text-right">
                          <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                            Skor
                          </p>
                          <p className="text-3xl font-semibold tabular-nums text-[#0F172A] sm:text-4xl">
                            {session.totalScore !== null ? session.totalScore : "—"}
                            <span className="text-lg font-medium text-[#64748B]">/100</span>
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm font-medium text-[#C9A227] transition group-hover:text-[#7C6312]">
                        Lihat detail hasil →
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default History
