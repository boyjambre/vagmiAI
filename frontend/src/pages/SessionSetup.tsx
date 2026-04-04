import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

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

function SessionSetup() {
  const navigate = useNavigate()
  const [posisi, setPosisi] = useState("")
  const [perusahaan, setPerusahaan] = useState("")
  const [jenisWawancara, setJenisWawancara] = useState<string>(jenisWawancaraOptions[0])
  const [tingkatKesulitan, setTingkatKesulitan] = useState<string>(
    tingkatKesulitanOptions[0],
  )
  const [deskripsi, setDeskripsi] = useState("")
  const [links, setLinks] = useState<string[]>([""])
  const [error, setError] = useState<string | null>(null)

  function updateLink(index: number, value: string) {
    setLinks((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  function addLink() {
    setLinks((prev) => [...prev, ""])
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!posisi.trim()) {
      setError("Posisi yang dilamar wajib diisi.")
      return
    }
    if (!deskripsi.trim()) {
      setError("Deskripsi pekerjaan atau fokus persiapan wajib diisi.")
      return
    }
    setError(null)
    navigate("/session/live")
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
                      className="shrink-0 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
                    >
                      Hapus
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
                className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
              >
                Mulai Sesi
              </button>
              <Link
                to="/dashboard"
                className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-[#E8D9A0]/60 bg-[#FAF6E8]/50 px-5 py-4 shadow-sm backdrop-blur">
          <p className="text-sm leading-6 text-[#475569]">
            <span className="font-medium text-[#7C6312]">Catatan: </span>
            Informasi yang kamu masukkan membantu sistem menyusun pertanyaan yang lebih kontekstual.
            Kamu dapat mengubah detail ini kapan saja sebelum sesi berlangsung di versi mendatang.
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
