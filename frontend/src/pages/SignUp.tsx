import type { FormEvent } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { getApiBaseUrl } from "../lib/apiBase"

function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [domicile, setDomicile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          domicile,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (!res.ok) {
        setError(data.message ?? "Registration failed")
        return
      }
      navigate("/signin")
    } catch {
      setError("Unable to reach the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10 text-[#111827]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-14rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#C9A227]/12 blur-3xl" />
        <div className="absolute right-[-12rem] top-[4rem] h-[42rem] w-[42rem] rounded-full bg-[#0F172A]/8 blur-3xl" />
        <div className="absolute bottom-[8rem] left-[10%] h-[34rem] w-[34rem] rounded-full bg-[#334155]/8 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[8%] h-[36rem] w-[36rem] rounded-full bg-[#C9A227]/10 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-[#475569] transition hover:text-[#0F172A]"
        >
          ← Kembali ke beranda
        </Link>

        <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Mulai Sekarang
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Buat akun VagmiAI
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#475569]">
              Mulai latihan wawancara dengan feedback multimodal yang lebih
              terstruktur.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <p
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Nama Lengkap
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="kamu@email.com"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-phone"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Nomor Telepon
              </label>
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="08xxxxxxxxxx atau +62..."
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-domicile"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Domisili
              </label>
              <input
                id="signup-domicile"
                type="text"
                name="domicile"
                autoComplete="address-level2"
                value={domicile}
                onChange={(ev) => setDomicile(ev.target.value)}
                placeholder="Kota atau wilayah tempat tinggal"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Kata Sandi
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses…" : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#475569]">
            Sudah punya akun?{" "}
            <Link
              to="/signin"
              className="font-medium text-[#0F172A] underline underline-offset-4"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
