import type { FormEvent } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { getApiBaseUrl } from "../lib/apiBase"

const AUTH_TOKEN_KEY = "vagmiai_auth_token"
const AUTH_USER_KEY = "vagmiai_auth_user"

function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        message?: string
        token?: string
        user?: { id: string; name: string; email: string }
      }
      if (!res.ok) {
        setError(data.message ?? "Invalid credentials")
        return
      }
      if (data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token)
      }
      if (data.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
      }
      navigate("/dashboard")
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
              Selamat Datang Kembali
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Masuk ke VagmiAI
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#475569]">
              Lanjutkan latihan wawancaramu dan tinjau kembali sesi yang sudah
              pernah dilakukan.
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
                htmlFor="signin-email"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Email
              </label>
              <input
                id="signin-email"
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
                htmlFor="signin-password"
                className="mb-2 block text-sm font-medium text-[#334155]"
              >
                Kata Sandi
              </label>
              <input
                id="signin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#475569]">
            Belum punya akun?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#0F172A] underline underline-offset-4"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
