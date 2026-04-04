import { Link } from "react-router-dom"

function SignIn() {
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

          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Email
              </label>
              <input
                type="email"
                placeholder="kamu@email.com"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="Masukkan kata sandi"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
            >
              Masuk
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