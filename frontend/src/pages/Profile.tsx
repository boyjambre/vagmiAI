import { useRef, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

import Navbar from "../components/Navbar"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#C9A227]/60 focus:ring-2 focus:ring-[#C9A227]/20"

type ProfileFormState = {
  namaLengkap: string
  email: string
  nomorTelepon: string
  domisili: string
  headline: string
}

const emptyForm: ProfileFormState = {
  namaLengkap: "",
  email: "",
  nomorTelepon: "",
  domisili: "",
  headline: "",
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProfileFormState>(emptyForm)
  const [baselineForm, setBaselineForm] = useState<ProfileFormState>(emptyForm)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [baselineCvFile, setBaselineCvFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function handleCvChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setCvFile(file)
    e.target.value = ""
  }

  function handleRemoveCv() {
    setCvFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleReplaceCv() {
    fileInputRef.current?.click()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccessMessage(null)

    if (!form.namaLengkap.trim()) {
      setError("Nama lengkap wajib diisi.")
      return
    }
    if (!form.email.trim()) {
      setError("Email wajib diisi.")
      return
    }
    if (!isValidEmail(form.email)) {
      setError("Format email tidak valid.")
      return
    }

    setError(null)
    setBaselineForm({ ...form })
    setBaselineCvFile(cvFile)
    setSuccessMessage("Perubahan profil berhasil disimpan (simulasi)")
    window.setTimeout(() => setSuccessMessage(null), 5000)
  }

  function handleReset() {
    setError(null)
    setSuccessMessage(null)
    setForm({ ...baselineForm })
    setCvFile(baselineCvFile)
    if (fileInputRef.current) fileInputRef.current.value = ""
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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">Profil</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Kelola profil dan dokumen pendukungmu
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
            Informasi di halaman ini membantu VagmiAI menyesuaikan sesi latihan wawancara agar lebih
            relevan dengan latar belakangmu.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          {error ? (
            <p
              className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {successMessage ? (
            <p
              className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]"
              role="status"
            >
              {successMessage}
            </p>
          ) : null}

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
            <h2 className="text-lg font-semibold text-[#0F172A]">Informasi Akun Dasar</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Data identitas dan ringkasan singkat yang membantu konteks sesi.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="namaLengkap" className="text-sm font-medium text-[#334155]">
                  Nama Lengkap
                </label>
                <input
                  id="namaLengkap"
                  name="namaLengkap"
                  type="text"
                  value={form.namaLengkap}
                  onChange={(e) => setForm((f) => ({ ...f, namaLengkap: e.target.value }))}
                  placeholder="Contoh: Cristiano Ronaldo"
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="text-sm font-medium text-[#334155]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Contoh: nama@email.com"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="nomorTelepon" className="text-sm font-medium text-[#334155]">
                  Nomor Telepon <span className="font-normal text-[#64748B]">(opsional)</span>
                </label>
                <input
                  id="nomorTelepon"
                  name="nomorTelepon"
                  type="tel"
                  value={form.nomorTelepon}
                  onChange={(e) => setForm((f) => ({ ...f, nomorTelepon: e.target.value }))}
                  placeholder="Contoh: 081234567890"
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="domisili" className="text-sm font-medium text-[#334155]">
                  Domisili / Lokasi <span className="font-normal text-[#64748B]">(opsional)</span>
                </label>
                <input
                  id="domisili"
                  name="domisili"
                  type="text"
                  value={form.domisili}
                  onChange={(e) => setForm((f) => ({ ...f, domisili: e.target.value }))}
                  placeholder="Contoh: Jakarta"
                  className={inputClass}
                  autoComplete="address-level2"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="headline" className="text-sm font-medium text-[#334155]">
                  Ringkasan Singkat Diri{" "}
                  <span className="font-normal text-[#64748B]">(opsional)</span>
                </label>
                <textarea
                  id="headline"
                  name="headline"
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                  placeholder="Tulis ringkasan singkat tentang latar belakang, minat, atau fokus kariermu"
                  rows={4}
                  className={`${inputClass} resize-y min-h-[6rem]`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-dashed border-[#C9A227]/50 bg-gradient-to-br from-white to-[#FAF6E8]/40 p-8 shadow-sm backdrop-blur lg:p-10">
            <h2 className="text-lg font-semibold text-[#0F172A]">Unggah CV</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              CV akan digunakan untuk konteks simulasi wawancara.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={handleCvChange}
            />
            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white/95 p-6 shadow-sm">
              {!cvFile ? (
                <div className="flex flex-col items-center justify-center gap-4 py-6 text-center sm:py-8">
                  <p className="text-sm text-[#475569]">Unggah file PDF atau Word (maks. sesuai browser).</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
                  >
                    Pilih File CV
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#7C6312]">
                      File terpilih
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-[#0F172A]">{cvFile.name}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {(cvFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleReplaceCv}
                      className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
                    >
                      Ganti File
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveCv}
                      className="rounded-full border border-[#FECACA] bg-[#FEF2F2] px-5 py-2.5 text-sm font-medium text-[#991B1B] transition hover:bg-[#FEE2E2]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
            >
              Reset Perubahan
            </button>
          </div>
        </form>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default Profile
