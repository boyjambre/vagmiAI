import { useState } from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

const sessionEvaluations = {
  session1:
    "Secara keseluruhan, jawaban sudah cukup relevan dan terstruktur.\n" +
    "Kekuatan utama terlihat pada kemampuan menjelaskan pengalaman dan motivasi.\n" +
    "Area yang masih dapat ditingkatkan adalah penyampaian contoh yang lebih konkret\n" +
    "dan konsistensi kepercayaan diri saat menjawab.",
  session2:
    "Motivasi dan alur jawaban cukup baik, namun masih bisa lebih spesifik.\n" +
    "Perkuat jawaban dengan metrik atau contoh singkat yang terhubung dengan kebutuhan peran.",
  session3:
    "Penyampaian cukup stabil dan key points sudah tersampaikan dengan baik.\n" +
    "Pertahankan struktur jawaban dan tambahkan satu contoh dampak untuk memperkuat kesan.",
} as const

type SessionResultMeta = {
  title: string
  score: number
  llmEvaluation: string
}

const sessionResultById: Record<string, SessionResultMeta> = {
  "session-1": {
    title: "Frontend Developer Interview",
    score: 84,
    llmEvaluation: sessionEvaluations.session1,
  },
  "session-2": {
    title: "Product Analyst Interview",
    score: 80,
    llmEvaluation: sessionEvaluations.session2,
  },
  "session-3": {
    title: "Backend Engineer Interview",
    score: 88,
    llmEvaluation: sessionEvaluations.session3,
  },
}

type QuestionResult = {
  question: string
  answer: string
  femScore: number
  llmScore: number
  evaluation: string
  overallScore: number
  optimalAnswer: string
}

const defaultSessionMeta: SessionResultMeta = {
  title: "Sesi latihan",
  score: 84,
  llmEvaluation: sessionEvaluations.session1,
}

const questions: QuestionResult[] = [
  {
    question:
      "Ceritakan tentang diri Anda dan pengalaman yang paling relevan untuk posisi ini.",
    answer:
      "Saya adalah seorang lulusan Informatika yang memiliki minat pada pengembangan web\n" +
      "dan sistem berbasis AI. Saya telah mengerjakan beberapa proyek full-stack dan juga\n" +
      "mengembangkan aplikasi yang memanfaatkan model AI untuk membantu pengguna.",
    femScore: 82,
    llmScore: 86,
    evaluation:
      "Jawaban cukup relevan dan memberikan gambaran umum yang baik tentang latar belakang.\n" +
      "Akan lebih kuat jika ditambahkan contoh proyek yang lebih spesifik dan hasil yang dicapai.",
    overallScore: 84,
    optimalAnswer:
      "Saya adalah lulusan Informatika dengan fokus pada pengembangan aplikasi web dan integrasi AI.\n" +
      "Dalam beberapa proyek terakhir, saya membangun sistem full-stack dan fitur berbasis AI\n" +
      "yang dirancang untuk menyelesaikan masalah nyata pengguna. Pengalaman tersebut melatih saya\n" +
      "untuk berpikir terstruktur, berkolaborasi, dan menghasilkan solusi yang dapat diimplementasikan.",
  },
  {
    question: "Mengapa Anda tertarik melamar posisi ini?",
    answer:
      "Saya tertarik karena posisi ini sesuai dengan minat dan pengalaman saya, terutama\n" +
      "dalam pengembangan sistem yang berdampak dan dapat digunakan secara nyata.",
    femScore: 78,
    llmScore: 83,
    evaluation:
      "Jawaban sudah menjelaskan motivasi dasar, tetapi masih terdengar umum.\n" +
      "Sebaiknya hubungkan alasan ketertarikan dengan perusahaan atau tanggung jawab posisi secara spesifik.",
    overallScore: 80,
    optimalAnswer:
      "Saya tertarik melamar posisi ini karena tanggung jawabnya sangat selaras dengan pengalaman saya\n" +
      "dalam membangun aplikasi yang fokus pada kebutuhan pengguna. Selain itu, saya melihat bahwa peran ini\n" +
      "memberi peluang untuk berkembang lebih jauh dalam area yang memang ingin saya tekuni secara profesional.",
  },
]

function SessionResults() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const sessionMeta =
    sessionId && sessionResultById[sessionId] ? sessionResultById[sessionId] : defaultSessionMeta

  const [optimalOpen, setOptimalOpen] = useState<Record<number, boolean>>({})

  function toggleOptimal(index: number) {
    setOptimalOpen((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const avgFem =
    questions.reduce((sum, q) => sum + q.femScore, 0) / questions.length
  const avgLlm =
    questions.reduce((sum, q) => sum + q.llmScore, 0) / questions.length

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            Evaluasi menggabungkan kualitas jawaban lisan dan analisis ekspresi wajah.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] shadow-sm transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>

        <section className="mt-8 rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
            Hasil Sesi
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Ringkasan evaluasi wawancara
          </h1>
          {sessionId && sessionResultById[sessionId] ? (
            <p className="mt-3 text-lg font-medium text-[#0F172A]">
              {sessionResultById[sessionId].title}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#475569]">
            Hasil ini memadukan penilaian kualitas jawaban Anda dan sinyal ekspresi wajah selama
            sesi, lalu dirangkum dalam skor keseluruhan dan umpan balik dari model bahasa.
          </p>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col items-start">
              <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
                Skor sesi
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight text-[#0F172A] sm:text-6xl">
                  {sessionMeta.score}
                </span>
                <span className="text-lg font-medium text-[#64748B]">/100</span>
              </div>
              <p className="mt-2 text-sm text-[#7C6312]">
                Gabungan skor jawaban dan ekspresi
              </p>
            </div>

            <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:max-w-none sm:grid-cols-3 lg:w-auto">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-medium text-[#64748B]">Pertanyaan</p>
                <p className="mt-1 text-2xl font-semibold text-[#0F172A]">{questions.length}</p>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-medium text-[#64748B]">Rata-rata ekspresi</p>
                <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                  {Math.round(avgFem)}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm sm:col-span-1">
                <p className="text-xs font-medium text-[#64748B]">Rata-rata jawaban</p>
                <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                  {Math.round(avgLlm)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#E8D9A0]/60 bg-[#FAF6E8]/40 p-6">
            <p className="text-sm font-semibold text-[#7C6312]">Evaluasi Overall</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#334155]">
              {sessionMeta.llmEvaluation}
            </p>
          </div>
        </section>

        <section className="mt-10 space-y-8">
          <div className="px-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Detail per pertanyaan
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Hasil tiap pertanyaan
            </h2>
          </div>

          {questions.map((item, index) => {
            const showOptimal = optimalOpen[index] === true
            return (
              <article
                key={index}
                className="rounded-[28px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full bg-[#0F172A] px-3 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold leading-snug text-[#0F172A] sm:text-xl">
                    {item.question}
                  </h3>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/90 px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Skor ekspresi
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
                      {item.femScore}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/90 px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Skor jawaban
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
                      {item.llmScore}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAF6E8]/60 px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#7C6312]">
                      Skor overall
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
                      {item.overallScore}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    Jawaban saya
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#334155]">
                    {item.answer}
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    Evaluasi jawaban
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#334155]">
                    {item.evaluation}
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => toggleOptimal(index)}
                    className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
                  >
                    {showOptimal ? "Sembunyikan Jawaban Optimal" : "Generate Optimal Answer"}
                  </button>
                </div>

                {showOptimal ? (
                  <div className="mt-6 rounded-2xl border border-[#C9A227]/35 bg-[#FFFCF0] p-6 shadow-sm">
                    <p className="text-sm font-semibold text-[#7C6312]">JAWABAN OPTIMAL</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#334155]">
                      {item.optimalAnswer}
                    </p>
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            to="/history"
            className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
          >
            Lihat Riwayat
          </Link>
        </div>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default SessionResults
