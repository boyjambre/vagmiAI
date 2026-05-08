import { useEffect, useState, useCallback, useRef } from "react"
import { Link, useParams } from "react-router-dom"

import Navbar from "../components/Navbar"
import { getApiBaseUrl } from "../lib/apiBase"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

// Statuses that mean evaluation is still running
const PENDING_STATUSES = new Set([
  "queued",
  "processing",
  "audio_extracted",
  "asr_completed",
  "fem_completed",
  "evaluating",
])

type ProcessingStatus =
  | "queued"
  | "processing"
  | "audio_extracted"
  | "asr_completed"
  | "fem_completed"
  | "evaluating"
  | "completed"
  | "failed"

type AnswerEvaluation = {
  strengths: string[]
  weaknesses: string[]
  evaluation: string
  improvementSuggestions: string[]
}

type SessionAnswer = {
  _id: string
  questionNumber: number
  questionText: string
  transcript: string
  videoPath?: string
  audioPath?: string
  asrMetadata: { modelName: string; language: string; duration: number | null } | null
  femResult: {
    dominantEmotion: string
    emotionDistribution: {
      positive?: number
      neutral?: number
      negative?: number
    }
    confidenceAverage: number
    expressionScore: number
  } | null
  femSummary: string
  answerEvaluation: AnswerEvaluation | null
  answerScore: number | null
  communicationScore: number | null
  expressionScore: number | null
  expressionComment: string
  overallQuestionScore: number | null
  optimalAnswer: string
  processingStatus: ProcessingStatus
  processingError: string
}

type SessionData = {
  _id: string
  title: string
  jobRole: string
  companyName: string
  totalQuestions: number
  totalScore: number | null
  overallEvaluation: string
  status: string
  generatedQuestions: Array<{
    questionId: string
    questionNumber: number
    questionText: string
    category: string
  }>
}

type ResultData = {
  session: SessionData
  answers: SessionAnswer[]
}

function statusLabel(status: ProcessingStatus): string {
  switch (status) {
    case "queued": return "Menunggu antrian…"
    case "processing": return "Memproses…"
    case "audio_extracted": return "Audio diekstrak, mentranskripsi…"
    case "asr_completed": return "Transkripsi selesai, analisis ekspresi…"
    case "fem_completed": return "Analisis ekspresi selesai, mengevaluasi…"
    case "evaluating": return "Mengevaluasi jawaban…"
    case "completed": return "Selesai"
    case "failed": return "Gagal diproses"
    default: return status
  }
}

function ScorePill({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number | null
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-center shadow-sm ${
        accent
          ? "border-[#E8D9A0]/60 bg-[#FAF6E8]/60"
          : "border-[#E2E8F0] bg-[#F8FAFC]/90"
      }`}
    >
      <p className={`text-xs font-medium uppercase tracking-wide ${accent ? "text-[#7C6312]" : "text-[#64748B]"}`}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  )
}

function ProcessingCard({ answer }: { answer: SessionAnswer }) {
  const [showMedia, setShowMedia] = useState(false)
  const hasMedia = answer.videoPath || answer.audioPath

  return (
    <div className="rounded-[28px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full bg-[#0F172A] px-3 text-sm font-semibold text-white">
          {answer.questionNumber}
        </span>
        <h3 className="text-lg font-semibold leading-snug text-[#0F172A] sm:text-xl">
          {answer.questionText}
        </h3>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        {answer.processingStatus !== "failed" ? (
          <span className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#C9A227]" />
        ) : (
          <span className="inline-block h-4 w-4 shrink-0 rounded-full bg-[#EF4444]" />
        )}
        <p className="text-sm font-medium text-[#334155]">
          {statusLabel(answer.processingStatus)}
        </p>
      </div>

      {answer.processingError ? (
        <p className="mt-4 text-xs text-[#DC2626]">{answer.processingError}</p>
      ) : null}

      {/* Media Toggle */}
      {hasMedia && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowMedia((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#64748B] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${showMedia ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            {showMedia ? "Sembunyikan Rekaman" : "Lihat Rekaman"}
          </button>

          {/* Media Players */}
          {showMedia && (
            <div className="mt-4 space-y-4">
              {answer.videoPath && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                    Rekaman Video
                  </p>
                  <video
                    controls
                    className="w-full rounded-xl"
                    src={`${getApiBaseUrl()}/media/video/${answer.videoPath.replace(/^shared_data\/video\//, '')}`}
                  />
                </div>
              )}
              {answer.audioPath && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                    Rekaman Audio
                  </p>
                  <audio
                    controls
                    className="w-full"
                    src={`${getApiBaseUrl()}/media/audio/${answer.audioPath.replace(/^shared_data\/audio\//, '')}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CompletedCard({ answer }: { answer: SessionAnswer }) {
  const [showOptimal, setShowOptimal] = useState(false)
  const [showMedia, setShowMedia] = useState(false)
  const hasMedia = answer.videoPath || answer.audioPath

  return (
    <article className="rounded-[28px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full bg-[#0F172A] px-3 text-sm font-semibold text-white">
          {answer.questionNumber}
        </span>
        <h3 className="text-lg font-semibold leading-snug text-[#0F172A] sm:text-xl">
          {answer.questionText}
        </h3>
      </div>

      {/* Scores */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <ScorePill label="Skor jawaban" value={answer.answerScore} />
        <ScorePill label="Komunikasi" value={answer.communicationScore} />
        <ScorePill label="Ekspresi" value={answer.expressionScore} />
        <ScorePill label="Skor overall" value={answer.overallQuestionScore} accent />
      </div>

      {/* Media Toggle */}
      {hasMedia && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowMedia((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#64748B] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${showMedia ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            {showMedia ? "Sembunyikan Rekaman" : "Lihat Rekaman"}
          </button>

          {/* Media Players */}
          {showMedia && (
            <div className="mt-4 space-y-4">
              {answer.videoPath && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                    Rekaman Video
                  </p>
                  <video
                    controls
                    className="w-full rounded-xl"
                    src={`${getApiBaseUrl()}/media/video/${answer.videoPath.replace(/^shared_data\/video\//, '')}`}
                  />
                </div>
              )}
              {answer.audioPath && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                    Rekaman Audio
                  </p>
                  <audio
                    controls
                    className="w-full"
                    src={`${getApiBaseUrl()}/media/audio/${answer.audioPath.replace(/^shared_data\/audio\//, '')}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      {answer.transcript && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Transkrip Jawaban
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#334155]">
            {answer.transcript}
          </p>
          {answer.asrMetadata?.duration && (
            <p className="mt-1 text-xs text-[#94A3B8]">
              Durasi: {Math.round(answer.asrMetadata.duration)}s · Bahasa: {answer.asrMetadata.language}
            </p>
          )}
        </div>
      )}

      {/* FEM */}
      {answer.femResult && (
        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Analisis Ekspresi Wajah
          </p>
          <p className="mt-2 text-sm text-[#334155]">
            Ekspresi dominan:{" "}
            <span className="font-medium capitalize">{answer.femResult.dominantEmotion}</span>
            {" · "}Confidence rata-rata:{" "}
            <span className="font-medium">{(answer.femResult.confidenceAverage * 100).toFixed(1)}%</span>
          </p>
          {answer.femSummary && (
            <p className="mt-1 text-xs text-[#64748B]">{answer.femSummary}</p>
          )}
          {answer.expressionComment && (
            <p className="mt-2 text-sm text-[#334155]">{answer.expressionComment}</p>
          )}
        </div>
      )}

      {/* Evaluation */}
      {answer.answerEvaluation && (
        <>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Evaluasi Jawaban
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#334155]">
              {answer.answerEvaluation.evaluation}
            </p>
          </div>

          {answer.answerEvaluation.strengths?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A]">
                Kekuatan
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {answer.answerEvaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[#334155]">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.answerEvaluation.weaknesses?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#DC2626]">
                Area Peningkatan
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {answer.answerEvaluation.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-[#334155]">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.answerEvaluation.improvementSuggestions?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7C6312]">
                Saran Peningkatan
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {answer.answerEvaluation.improvementSuggestions.map((s, i) => (
                  <li key={i} className="text-sm text-[#334155]">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Optimal answer */}
      {answer.optimalAnswer && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowOptimal((v) => !v)}
            className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            {showOptimal ? "Sembunyikan Jawaban Optimal" : "Lihat Jawaban Optimal"}
          </button>
          {showOptimal && (
            <div className="mt-6 rounded-2xl border border-[#C9A227]/35 bg-[#FFFCF0] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#7C6312]">JAWABAN OPTIMAL</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#334155]">
                {answer.optimalAnswer}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function SessionResults() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [data, setData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchResults = useCallback(async () => {
    if (!sessionId) return
    try {
      const token = localStorage.getItem("vagmiai_auth_token")
      const res = await fetch(`${getApiBaseUrl()}/api/sessions/${sessionId}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || "Gagal memuat hasil.")
      setData(json.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    void fetchResults()
  }, [fetchResults])

  // Poll while any answer is still in progress
  useEffect(() => {
    if (!data) return

    const hasInProgress = data.answers.some((a) => PENDING_STATUSES.has(a.processingStatus))

    if (hasInProgress) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          void fetchResults()
        }, 5000)
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [data, fetchResults])

  // Build lookup: questionNumber → answer
  const answerMap = new Map<number, SessionAnswer>(
    (data?.answers ?? []).map((a) => [a.questionNumber, a])
  )

  const session = data?.session

  const allComplete = data
    ? data.answers.length > 0 && data.answers.every((a) => !PENDING_STATUSES.has(a.processingStatus))
    : false

  const completedAnswers = data?.answers.filter((a) => a.processingStatus === "completed") ?? []
  const avgExpression =
    completedAnswers.length > 0
      ? Math.round(
          completedAnswers.reduce((s, a) => s + (a.expressionScore ?? 0), 0) /
            completedAnswers.length
        )
      : null
  const avgAnswer =
    completedAnswers.length > 0
      ? Math.round(
          completedAnswers.reduce((s, a) => s + (a.answerScore ?? 0), 0) /
            completedAnswers.length
        )
      : null

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
            {!allComplete && data && (
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[#E8D9A0] bg-[#FAF6E8] px-2.5 py-0.5 text-xs font-medium text-[#7C6312]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#C9A227]" />
                Sedang memproses…
              </span>
            )}
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

        {/* Loading */}
        {loading && !data && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#C9A227]" />
            <p className="text-sm text-[#64748B]">Memuat hasil sesi…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        )}

        {/* Summary section */}
        {session && (
          <section className="mt-8 rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Hasil Sesi
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              Ringkasan evaluasi wawancara
            </h1>
            {session.title && (
              <p className="mt-3 text-lg font-medium text-[#0F172A]">{session.title}</p>
            )}
            {(session.jobRole || session.companyName) && (
              <p className="mt-1 text-sm text-[#64748B]">
                {session.jobRole}
                {session.jobRole && session.companyName ? " · " : ""}
                {session.companyName}
              </p>
            )}
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
                    {session.totalScore !== null && session.totalScore !== undefined
                      ? session.totalScore
                      : allComplete
                        ? "—"
                        : "…"}
                  </span>
                  <span className="text-lg font-medium text-[#64748B]">/100</span>
                </div>
                <p className="mt-2 text-sm text-[#7C6312]">
                  {session.status === "completed"
                    ? "Gabungan skor jawaban dan ekspresi"
                    : "Menunggu semua jawaban selesai diproses"}
                </p>
              </div>

              <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:max-w-none sm:grid-cols-3 lg:w-auto">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-medium text-[#64748B]">Pertanyaan</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                    {session.totalQuestions}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-medium text-[#64748B]">Rata-rata ekspresi</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                    {avgExpression !== null ? avgExpression : "—"}
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-3 text-center shadow-sm sm:col-span-1">
                  <p className="text-xs font-medium text-[#64748B]">Rata-rata jawaban</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                    {avgAnswer !== null ? avgAnswer : "—"}
                  </p>
                </div>
              </div>
            </div>

            {session.overallEvaluation && (
              <div className="mt-10 rounded-2xl border border-[#E8D9A0]/60 bg-[#FAF6E8]/40 p-6">
                <p className="text-sm font-semibold text-[#7C6312]">Evaluasi Overall</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#334155]">
                  {session.overallEvaluation}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Per-question results */}
        {session && (
          <section className="mt-10 space-y-8">
            <div className="px-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
                Detail per pertanyaan
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
                Hasil tiap pertanyaan
              </h2>
            </div>

            {session.generatedQuestions.map((q) => {
              const answer = answerMap.get(q.questionNumber)

              if (!answer) {
                // Question not yet submitted
                return (
                  <div
                    key={q.questionId}
                    className="rounded-[28px] border border-[#E2E8F0] bg-white/90 p-8 opacity-60 shadow-sm backdrop-blur"
                  >
                    <div className="flex gap-3">
                      <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full bg-[#E2E8F0] px-3 text-sm font-semibold text-[#64748B]">
                        {q.questionNumber}
                      </span>
                      <p className="text-base font-medium text-[#334155]">{q.questionText}</p>
                    </div>
                    <p className="mt-4 text-sm text-[#94A3B8]">Belum ada jawaban untuk pertanyaan ini.</p>
                  </div>
                )
              }

              if (answer.processingStatus === "completed") {
                return <CompletedCard key={q.questionId} answer={answer} />
              }

              return <ProcessingCard key={q.questionId} answer={answer} />
            })}
          </section>
        )}

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
