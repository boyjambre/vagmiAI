import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { getApiBaseUrl } from "../lib/apiBase"
import Navbar from "../components/Navbar"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

const jenisWawancaraOptions = [
  "HR / Behavioral",
  "Technical",
  "Case Study",
  "General",
] as const

const tingkatKesulitanOptions = ["Pemula", "Menengah", "Lanjutan"] as const

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#C9A227]/60 focus:ring-2 focus:ring-[#C9A227]/20"

type GeneratedQuestion = {
  questionId: string
  questionNumber: number
  questionText: string
  category: string
  difficulty: string
}

type SessionData = {
  sessionId: string
  generatedQuestions: GeneratedQuestion[]
  contextSummary: { cv: string; links: string; search: string }
  metadata: { interviewType: string; difficulty: string; model: string; questionCount: number }
}

function SessionSetup() {
  const navigate = useNavigate()
  const [posisi, setPosisi] = useState("")
  const [perusahaan, setPerusahaan] = useState("")
  const [jenisWawancara, setJenisWawancara] = useState<string>(jenisWawancaraOptions[0])
  const [tingkatKesulitan, setTingkatKesulitan] = useState<string>(tingkatKesulitanOptions[0])
  const [deskripsi, setDeskripsi] = useState("")
  const [links, setLinks] = useState<string[]>([""])
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  function updateLink(index: number, value: string) {
    setLinks((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  function addLink() {
    setLinks((prev) => [...prev, ""])
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!posisi.trim()) {
      setError("Posisi yang dilamar wajib diisi.")
      return
    }
    if (!deskripsi.trim()) {
      setError("Deskripsi pekerjaan atau fokus persiapan wajib diisi.")
      return
    }
    if (questionCount < 1 || questionCount > 15) {
      setError("Jumlah pertanyaan harus antara 1 dan 15.")
      return
    }
    setError(null)
    setIsLoading(true)

    try {
      const token = localStorage.getItem("vagmiai_auth_token")

      // Call the new /api/sessions/create endpoint that persists to MongoDB
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          position: posisi,
          company: perusahaan,
          links: links.filter((l) => l.trim() !== ""),
          interviewType: jenisWawancara,
          difficulty: tingkatKesulitan,
          description: deskripsi,
          questionCount,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat sesi wawancara.")
      }

      setSessionData(data.data)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada server. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
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
            Persiapan Sesi
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Atur sesi latihan wawancaramu
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
            Isi data persiapan di bawah agar AI dapat menyusun pertanyaan wawancara yang lebih
            relevan dengan konteks posisi dan tujuan latihanmu.
          </p>
        </section>

        <section className="mt-10 rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
          {!sessionData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <p
                  className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div>
                <label htmlFor="posisi" className="text-sm font-medium text-[#334155]">
                  Posisi yang Dilamar
                </label>
                <input
                  id="posisi"
                  name="posisi"
                  type="text"
                  value={posisi}
                  onChange={(e) => setPosisi(e.target.value)}
                  placeholder="Contoh: Frontend Developer"
                  className={inputClass}
                  autoComplete="organization-title"
                />
              </div>

              <div>
                <label htmlFor="perusahaan" className="text-sm font-medium text-[#334155]">
                  Perusahaan / Instansi{" "}
                  <span className="font-normal text-[#64748B]">(opsional)</span>
                </label>
                <input
                  id="perusahaan"
                  name="perusahaan"
                  type="text"
                  value={perusahaan}
                  onChange={(e) => setPerusahaan(e.target.value)}
                  placeholder="Contoh: Tokopedia"
                  className={inputClass}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#334155]">Links</label>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  Tambahkan link lowongan, perusahaan, atau referensi lain jika diperlukan
                </p>
                <div className="mt-2 space-y-3">
                  {links.map((link, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-3">
                      <input
                        id={`link-${index}`}
                        name={`link-${index}`}
                        type="text"
                        inputMode="url"
                        autoComplete="url"
                        value={link}
                        onChange={(e) => updateLink(index, e.target.value)}
                        placeholder="https://"
                        className={`${inputClass} !mt-0 min-w-0 flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="shrink-0 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-800 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        title="Hapus link"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  className="mt-3 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
                >
                  Tambah Link
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="jenisWawancara" className="text-sm font-medium text-[#334155]">
                    Jenis Wawancara
                  </label>
                  <select
                    id="jenisWawancara"
                    name="jenisWawancara"
                    value={jenisWawancara}
                    onChange={(e) => setJenisWawancara(e.target.value)}
                    className={inputClass}
                  >
                    {jenisWawancaraOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tingkatKesulitan" className="text-sm font-medium text-[#334155]">
                    Tingkat Kesulitan
                  </label>
                  <select
                    id="tingkatKesulitan"
                    name="tingkatKesulitan"
                    value={tingkatKesulitan}
                    onChange={(e) => setTingkatKesulitan(e.target.value)}
                    className={inputClass}
                  >
                    {tingkatKesulitanOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="questionCount" className="text-sm font-medium text-[#334155]">
                    Jumlah Pertanyaan
                  </label>
                  <input
                    id="questionCount"
                    name="questionCount"
                    type="number"
                    min="1"
                    max="15"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    placeholder="Contoh: 5"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deskripsi" className="text-sm font-medium text-[#334155]">
                  Deskripsi Pekerjaan / Fokus Persiapan
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Masukkan konteks, job description, atau fokus latihan yang ingin diprioritaskan"
                  rows={5}
                  className={`${inputClass} resize-y min-h-[8rem]`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Menyiapkan Sesi..." : "Mulai Sesi"}
                </button>
                <Link
                  to="/dashboard"
                  className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
                >
                  Kembali ke Dashboard
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="border-b border-[#E2E8F0] pb-5">
                <h2 className="text-2xl font-semibold text-[#0F172A]">Sesi Latihan Berhasil Disiapkan</h2>
                <p className="mt-2 text-sm text-[#475569]">
                  AI telah menghasilkan pertanyaan berdasarkan profil dan target posisi Anda.
                  Sesi disimpan dengan ID:{" "}
                  <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-xs font-mono text-[#334155]">
                    {sessionData.sessionId}
                  </code>
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Informasi Sesi</h3>
                  <ul className="mt-4 space-y-3 text-sm text-[#334155]">
                    <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Tipe</span>
                      <strong>{sessionData.metadata.interviewType}</strong>
                    </li>
                    <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Kesulitan</span>
                      <strong>{sessionData.metadata.difficulty}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#64748B]">Model</span>
                      <strong>{sessionData.metadata.model}</strong>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Konteks Referensi</h3>
                  <ul className="mt-4 space-y-3 text-sm text-[#334155]">
                    <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Profil CV</span>
                      <strong>{sessionData.contextSummary.cv}</strong>
                    </li>
                    <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Web Search</span>
                      <strong>{sessionData.contextSummary.search}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#64748B]">Links Tambahan</span>
                      <strong>{sessionData.contextSummary.links}</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium text-[#0F172A]">
                  Daftar Pertanyaan ({sessionData.generatedQuestions.length})
                </h3>
                <ul className="space-y-3">
                  {sessionData.generatedQuestions.map((q, idx) => (
                    <li key={q.questionId} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                      <div className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F172A]/5 text-sm font-semibold text-[#0F172A]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-[#1E293B]">{q.questionText}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-md bg-[#EEF2F6] px-2 py-1 text-xs font-medium text-[#475569] ring-1 ring-inset ring-[#CBD5E1]/20">
                              {q.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/session/live", {
                      state: {
                        sessionId: sessionData.sessionId,
                        questions: sessionData.generatedQuestions,
                      },
                    })
                  }
                  className="rounded-full bg-[#0F172A] px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#1E293B]"
                >
                  Mulai Simulasi Wawancara
                </button>
                <button
                  type="button"
                  onClick={() => setSessionData(null)}
                  className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC]"
                >
                  Ubah Parameter
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-[#E8D9A0]/60 bg-[#FAF6E8]/50 px-5 py-4 shadow-sm backdrop-blur">
          <p className="text-sm leading-6 text-[#475569]">
            <span className="font-medium text-[#7C6312]">Catatan: </span>
            Informasi yang kamu masukkan membantu sistem menyusun pertanyaan yang lebih kontekstual.
            Sesi ini tersimpan otomatis di database dan dapat dilihat kembali di halaman Riwayat.
          </p>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default SessionSetup
