import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

type Slide = {
  title: string
  description: string
  tag: string
  stat: string
}

function Landing() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Simulasi Wawancara",
        description:
          "Latih sesi wawancara yang realistis dengan pertanyaan berbasis AI yang disesuaikan dengan posisi yang kamu tuju.",
        tag: "Fitur Utama",
        stat: "Alur pertanyaan adaptif",
      },
      {
        title: "Speech Transcription",
        description:
          "Tinjau jawaban lisanmu melalui transkripsi otomatis dan umpan balik verbal yang terstruktur.",
        tag: "Multimodal",
        stat: "Evaluasi performa verbal",
      },
      {
        title: "Analisis Ekspresi Wajah",
        description:
          "Pahami cara penyampaian non-verbal melalui umpan balik berbasis ekspresi dan insight presentasi.",
        tag: "Analisis",
        stat: "Pelacakan sinyal non-verbal",
      },
    ],
    [],
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  const features = [
    {
      title: "Pertanyaan Wawancara yang Kontekstual",
      description:
        "VagmiAI menggunakan Large Language Model sebagai mesin penalaran utama untuk menghasilkan pertanyaan wawancara yang relevan berdasarkan posisi target dan konteks persiapanmu.",
      icon: "01",
    },
    {
      title: "Review Jawaban dengan Speech-to-Text",
      description:
        "OpenAI Whisper mentranskripsikan jawaban lisanmu ke dalam bentuk teks agar performa verbal dapat ditinjau dengan lebih jelas dan konsisten.",
      icon: "02",
    },
    {
      title: "Umpan Balik Berbasis Ekspresi",
      description:
        "Facial emotion model melacak isyarat ekspresi yang terlihat selama kamu menjawab untuk membantu mengevaluasi penyampaian, ketenangan, dan komunikasi non-verbal.",
      icon: "03",
    },
    {
      title: "Insight Perbaikan yang Terstruktur",
      description:
        "Sistem menggabungkan analisis pertanyaan, transkrip, dan sinyal ekspresi menjadi umpan balik yang dapat digunakan untuk meningkatkan sesi latihan berikutnya.",
      icon: "04",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Input Persiapan",
      description:
        "Kamu memulai dengan memasukkan konteks wawancara seperti posisi, perusahaan, dan detail persiapan lainnya.",
      detail:
        "LLM menggunakan konteks ini untuk membentuk pertanyaan yang lebih relevan dan terarah.",
    },
    {
      number: "02",
      title: "Simulasi Wawancara",
      description:
        "VagmiAI menghasilkan dan menampilkan pertanyaan wawancara dalam sesi latihan yang terstruktur.",
      detail:
        "Hal ini membuat pengalaman latihan terasa lebih mendekati wawancara nyata dibandingkan tanya jawab biasa.",
    },
    {
      number: "03",
      title: "Pemrosesan Multimodal",
      description:
        "Responsmu diproses melalui transkripsi audio dan analisis ekspresi wajah.",
      detail:
        "OpenAI Whisper menangani transkripsi, sementara facial emotion model melacak isyarat penyampaian yang terlihat.",
    },
    {
      number: "04",
      title: "Feedback & Refleksi",
      description:
        "Sistem menyatukan sinyal verbal dan non-verbal menjadi umpan balik yang praktis.",
      detail:
        "Hasilnya bisa kamu gunakan untuk memperbaiki kualitas jawaban, gaya berbicara, dan rasa percaya diri.",
    },
  ]

  const techHighlights = [
    {
      label: "LLM",
      title: "Reasoning Engine",
      description:
        "Digunakan sebagai inti AI untuk memahami konteks, menghasilkan pertanyaan, dan mengorkestrasi feedback.",
    },
    {
      label: "Whisper",
      title: "Speech Transcription",
      description:
        "Mengubah jawaban lisan menjadi teks transkrip untuk analisis dan peninjauan lanjutan.",
    },
    {
      label: "FEM",
      title: "Facial Emotion Model",
      description:
        "Melacak sinyal ekspresi untuk mendukung penilaian komunikasi non-verbal.",
    },
  ]

  const techStack = [
    {
      label: "LLM",
      title: "Language Model Core",
      description:
        "Berperan sebagai mesin penalaran untuk memahami konteks, menghasilkan pertanyaan wawancara, dan mengorkestrasi feedback.",
    },
    {
      label: "Whisper",
      title: "Speech Transcription",
      description:
        "OpenAI Whisper mengubah jawaban wawancara lisan menjadi teks transkrip untuk review verbal dan analisis lanjutan.",
    },
    {
      label: "FEM",
      title: "Facial Emotion Model",
      description:
        "Melacak isyarat ekspresi wajah saat pengguna menjawab untuk membantu menilai komunikasi non-verbal dan penyampaian.",
    },
    {
      label: "Frontend",
      title: "React + TypeScript",
      description:
        "Menyediakan antarmuka responsif untuk simulasi wawancara, tampilan feedback, dan pengembangan dashboard ke depannya.",
    },
    {
      label: "Backend",
      title: "Express.js",
      description:
        "Menangani orkestrasi alur wawancara, pemrosesan model, dan pengelolaan data aplikasi.",
    },
    {
      label: "Database",
      title: "MongoDB",
      description:
        "Menyimpan data pengguna, konteks persiapan, sesi wawancara, serta hasil feedback yang dihasilkan sistem.",
    },
  ]

  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    const sectionIds = ["about", "how-it-works", "features", "tech"]

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )

          setActiveSection(mostVisible.target.id)
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.45, 0.6],
      }
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-14rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#C9A227]/12 blur-3xl" />
        <div className="absolute right-[-12rem] top-[4rem] h-[42rem] w-[42rem] rounded-full bg-[#0F172A]/8 blur-3xl" />
        <div className="absolute bottom-[8rem] left-[10%] h-[34rem] w-[34rem] rounded-full bg-[#334155]/8 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[8%] h-[36rem] w-[36rem] rounded-full bg-[#C9A227]/10 blur-3xl" />
      </div>

      <header className="sticky top-4 z-50 px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[#E2E8F0]/80 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/VagmiAI_Logo.png"
                alt="VagmiAI Logo"
                className="h-15 w-15 object-contain"
              />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-[#0F172A]">
                VagmiAI
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1 md:flex">
            {[
              { id: "about", label: "Tentang" },
              { id: "how-it-works", label: "Cara Kerja" },
              { id: "features", label: "Fitur" },
              { id: "tech", label: "Tech Stack" },
            ].map((item) => {
              const isActive = activeSection === item.id

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-[#C9A227]"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
            >
              Daftar
            </Link>
            <Link
              to="/signin"
              className="rounded-full bg-[#0F172A] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
            <div className="flex flex-col justify-center">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text4xl lg:text-4xl">
                Berlatih wawancara dengan feedback cerdas yang membantu meningkatkan isi jawaban sekaligus cara kamu menyampaikannya.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#475569]">
                VagmiAI menggabungkan simulasi wawancara berbasis AI, speech transcription, dan analisis ekspresi wajah untuk mendukung pengalaman latihan yang lebih lengkap dan terstruktur.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95">
                  Mulai Latihan
                </button>
                <button className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]">
                  Jelajahi Fitur
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-[#64748B]">Fokus</p>
                  <p className="mt-2 text-sm font-medium text-[#0F172A]">
                    Kesiapan Wawancara
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-[#64748B]">Pendekatan</p>
                  <p className="mt-2 text-sm font-medium text-[#0F172A]">
                    Analisis Multimodal
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-[#64748B]">Tujuan</p>
                  <p className="mt-2 text-sm font-medium text-[#0F172A]">
                    Penyampaian Percaya Diri
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#E2E8F0] bg-white/90 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7C6312]">
                    Mengapa ini penting
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">
                    Persiapan wawancara sering kali hanya berfokus pada isi jawaban, sementara penyampaian, ekspresi, dan rasa percaya diri masih sulit dievaluasi secara terstruktur.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#1E293B] bg-[#0F172A] p-5 text-white shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#E7D7A1]">
                    Arah produk
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Sebuah interview coach yang lebih lengkap dengan memadukan language intelligence, voice review, dan analisis non-verbal dalam satu pengalaman yang terarah.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-xl">
                <div className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-5 shadow-sm backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
                        Preview Fitur
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Bisa diganti dengan screenshot aplikasi nanti
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevSlide}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextSlide}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-white transition hover:opacity-95"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="border-b border-[#E2E8F0] bg-white px-5 py-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#E8D9A0] bg-[#FAF6E8] px-3 py-1 text-xs font-medium text-[#7C6312]">
                          {slides[currentSlide].tag}
                        </span>
                        <span className="text-xs text-[#94A3B8]">
                          Slide {currentSlide + 1} / {slides.length}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] text-2xl font-semibold text-[#0F172A]">
                          {currentSlide + 1}
                        </div>
                        <p className="text-sm text-[#64748B]">
                          Letakkan screenshot fitur di sini nanti
                        </p>
                      </div>

                      <div className="mt-5">
                        <h3 className="text-xl font-semibold text-[#0F172A]">
                          {slides[currentSlide].title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#475569]">
                          {slides[currentSlide].description}
                        </p>

                        <div className="mt-4 inline-flex rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155]">
                          {slides[currentSlide].stat}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          currentSlide === index
                            ? "w-8 bg-[#0F172A]"
                            : "w-2.5 bg-[#CBD5E1]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.title}
                        onClick={() => goToSlide(index)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          currentSlide === index
                            ? "border-[#0F172A] bg-[#0F172A] text-white"
                            : "border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1]"
                        }`}
                      >
                        <p className="text-sm font-medium">{slide.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
            <div className="grid gap-4 rounded-[32px] border border-[#E2E8F0] bg-white/90 p-5 shadow-sm backdrop-blur md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#7C6312]">
                  Dirancang untuk
                </p>
                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  Persiapan wawancara
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#7C6312]">
                  Analisis
                </p>
                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  Transkrip dan Ekspresi Wajah
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#7C6312]">
                  Pengalaman
                </p>
                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  Terstruktur dan dapat diulang
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#7C6312]">
                  Hasil
                </p>
                <p className="mt-2 text-sm font-medium text-[#0F172A]">
                  Penyampaian yang lebih percaya diri
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
                Latar Belakang & Motivasi
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A]">
                Persiapan wawancara sering kali belum memiliki feedback yang terstruktur, berulang, dan multimodal.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#475569]">
                VagmiAI dirancang untuk membantu pengguna berlatih secara lebih efektif dengan menggabungkan simulasi pertanyaan wawancara dan analisis performa verbal maupun non-verbal. Hasilnya adalah pengalaman latihan yang lebih lengkap untuk mendukung persiapan, refleksi, dan peningkatan berkelanjutan.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {techHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7C6312]">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Cara Kerja
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Alur multimodal yang dirancang untuk mensimulasikan, mengamati, dan meningkatkan performa.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#475569]">
              VagmiAI tidak berhenti hanya pada pemberian pertanyaan. Sistem ini memanfaatkan language intelligence, speech transcription, dan pelacakan ekspresi untuk menghasilkan feedback wawancara yang lebih kaya dari berbagai sinyal.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative overflow-hidden rounded-[30px] border p-6 shadow-sm ${
                  index % 2 === 0
                    ? "border-[#E2E8F0] bg-white/90 backdrop-blur"
                    : "border-[#1E293B] bg-[#0F172A] text-white"
                }`}
              >
                <div
                  className={`absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl ${
                    index % 2 === 0 ? "bg-[#C9A227]/10" : "bg-white/10"
                  }`}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold ${
                      index % 2 === 0
                        ? "bg-[#0F172A] text-white"
                        : "bg-white text-[#0F172A]"
                    }`}
                  >
                    {step.number}
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                  <p
                    className={`mt-3 text-sm leading-7 ${
                      index % 2 === 0 ? "text-[#475569]" : "text-slate-300"
                    }`}
                  >
                    {step.description}
                  </p>

                  <div
                    className={`mt-5 rounded-2xl border px-4 py-4 text-sm leading-7 ${
                      index % 2 === 0
                        ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]"
                        : "border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Apa yang Bisa Dilakukan
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Lebih dari sekadar chatbot, VagmiAI adalah sistem latihan wawancara yang terarah.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-[30px] border p-6 shadow-sm transition hover:-translate-y-1 ${
                  index === 1 || index === 2
                    ? "border-[#1E293B] bg-[#0F172A] text-white"
                    : "border-[#E2E8F0] bg-white/90 backdrop-blur"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold ${
                    index === 1 || index === 2
                      ? "bg-white text-[#0F172A]"
                      : "bg-[#0F172A] text-white"
                  }`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    index === 1 || index === 2 ? "text-slate-300" : "text-[#475569]"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="tech" className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Tech Stack
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Dibangun dengan language intelligence, speech processing, dan analisis ekspresi.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#475569]">
              VagmiAI menggabungkan teknologi web modern dengan komponen pemrosesan berbasis AI untuk mensimulasikan wawancara, menganalisis respons, dan memberikan feedback yang terstruktur dari berbagai modalitas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {techStack.map((item, index) => (
              <div
                key={item.title}
                className={`group rounded-[30px] border p-6 shadow-sm transition hover:-translate-y-1 ${
                  index === 1 || index === 4
                    ? "border-[#1E293B] bg-[#0F172A] text-white"
                    : "border-[#E2E8F0] bg-white/90 backdrop-blur"
                }`}
              >
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
                    index === 1 || index === 4
                      ? "bg-white/10 text-[#E7D7A1]"
                      : "bg-[#FAF6E8] text-[#7C6312]"
                  }`}
                >
                  {item.label}
                </div>

                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>

                <p
                  className={`mt-3 text-sm leading-7 ${
                    index === 1 || index === 4 ? "text-slate-300" : "text-[#475569]"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl items-center justify-center px-5 py-6 text-center text-xs text-gray-600">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} VagmiAI. Seluruh hak cipta dilindungi.</span>
          <span className="text-gray-300">•</span>
          <img
            src="/logo_upnvj.png"
            alt="UPNVJ"
            className="h-6 w-6 rounded-sm shadow-sm ring-1 ring-gray-200"
            title='Universitas Pembangunan Nasional "Veteran" Jakarta'
          />
          <span className="hidden sm:inline">
            Universitas Pembangunan Nasional "Veteran" Jakarta
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Landing