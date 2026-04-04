import { Link } from "react-router-dom"

function SignUp() {
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

          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

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
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx atau +62..."
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Domisili
              </label>
              <input
                type="text"
                name="domicile"
                autoComplete="address-level2"
                placeholder="Kota atau wilayah tempat tinggal"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="Buat kata sandi"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition focus:border-[#C9A227]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#0F172A] px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
            >
              Daftar
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