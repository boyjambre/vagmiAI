import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getApiBaseUrl } from "../lib/apiBase"

type RecentSession = {
  _id: string
  title: string
  createdAt: string
  status: string
  totalScore: number | null
}

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

function Dashboard() {
  const [sessions, setSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecentSessions = useCallback(async () => {
    try {
      const token = localStorage.getItem("vagmiai_auth_token")
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        // Take only top 3 for dashboard
        setSessions((json.data ?? []).slice(0, 3))
      }
    } catch (err) {
      console.error("Failed to fetch recent sessions", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchRecentSessions()
  }, [fetchRecentSessions])

  function getStatusLabel(status: string) {
    switch (status) {
      case "active":
        return { label: "Aktif", color: "text-[#64748B] bg-[#F1F5F9] border-[#E2E8F0]" }
      case "processing":
        return { label: "Proses", color: "text-[#7C6312] bg-[#FAF6E8] border-[#E8D9A0]" }
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
                {sessions.length > 0 
                  ? "Tinjau performa terakhir dari latihan wawancara Anda."
                  : "Anda belum melakukan latihan wawancara."}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0]">
            {loading ? (
              <div className="flex items-center justify-center bg-white py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#C9A227]" />
              </div>
            ) : sessions.length > 0 ? (
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
                  {sessions.map((session) => {
                    const badge = getStatusLabel(session.status)
                    const dateStr = new Date(session.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })
                    return (
                      <tr
                        key={session._id}
                        className="border-b border-[#E2E8F0] last:border-0 bg-white transition hover:bg-[#F8FAFC]/80 cursor-pointer"
                        onClick={() => (window.location.href = `/results/${session._id}`)}
                      >
                        <td className="px-4 py-4 font-medium text-[#0F172A]">{session.title}</td>
                        <td className="hidden px-4 py-4 text-[#475569] sm:table-cell">
                          {dateStr}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-[#0F172A]">
                          {session.totalScore !== null ? session.totalScore : "—"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="bg-white py-12 text-center text-sm text-[#64748B]">
                Belum ada data sesi.
              </div>
            )}
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

