import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"

const dashboardNavItems = [
  { label: "Latihan", to: "/session/setup" },
  { label: "Riwayat", to: "/history" },
]

const MOCK_QUESTIONS = [
  "Ceritakan tentang diri Anda dan pengalaman yang paling relevan untuk posisi ini.",
  "Mengapa Anda tertarik melamar posisi ini?",
  "Ceritakan tantangan teknis atau kerja tim yang pernah Anda hadapi dan bagaimana Anda menyelesaikannya.",
  "Apa kelebihan utama Anda yang menurut Anda paling sesuai untuk peran ini?",
  "Di area mana Anda masih ingin berkembang?",
] as const

type RecordingState = "idle" | "recording" | "stopped"
type SessionPhase = "overview" | "live" | "completed"

function pickRecorderMimeType(): string | undefined {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ]
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) {
      return c
    }
  }
  return undefined
}

function SessionLive() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const blobUrlsRef = useRef<string[]>([])
  const liveMountIdRef = useRef(0)

  const [phase, setPhase] = useState<SessionPhase>("overview")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([])
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [recorderError, setRecorderError] = useState<string | null>(null)

  const totalQuestions = MOCK_QUESTIONS.length
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  function trackBlobUrl(url: string) {
    blobUrlsRef.current.push(url)
  }

  function revokeBlobUrl(url: string) {
    URL.revokeObjectURL(url)
    blobUrlsRef.current = blobUrlsRef.current.filter((u) => u !== url)
  }

  function revokeAllBlobUrls() {
    blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    blobUrlsRef.current = []
  }

  useEffect(() => {
    return () => {
      revokeAllBlobUrls()
    }
  }, [])

  useEffect(() => {
    if (phase !== "completed") return
    const t = window.setTimeout(() => {
      navigate("/results/session-1")
    }, 1600)
    return () => window.clearTimeout(t)
  }, [phase, navigate])

  useEffect(() => {
    if (phase !== "live") {
      return
    }

    liveMountIdRef.current += 1

    let stream: MediaStream | null = null
    let cancelled = false

    setCameraError(null)
    setCameraReady(false)
    setRecorderError(null)

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraError("Peramban Anda tidak mendukung akses kamera.")
        }
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        mediaStreamRef.current = stream

        const el = videoRef.current
        if (el) {
          el.srcObject = stream
          await el.play().catch(() => {})
        }

        if (!cancelled) {
          setCameraReady(true)
          setCameraError(null)
        }
      } catch {
        if (!cancelled) {
          setCameraError(
            "Kamera atau mikrofon tidak dapat diakses. Pastikan izin sudah diberikan.",
          )
          setCameraReady(false)
        }
      }
    }

    void startCamera()

    return () => {
      cancelled = true
      liveMountIdRef.current += 1
      const rec = mediaRecorderRef.current
      if (rec && rec.state !== "inactive") {
        rec.stop()
      }
      mediaRecorderRef.current = null
      recordedChunksRef.current = []
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaStreamRef.current = null
      const el = videoRef.current
      if (el) {
        el.srcObject = null
      }
    }
  }, [phase])

  useEffect(() => {
    if (phase !== "live" || recordedVideoUrl || !cameraReady) return
    const el = videoRef.current
    const stream = mediaStreamRef.current
    if (!el || !stream) return
    el.srcObject = stream
    void el.play().catch(() => {})
  }, [phase, recordedVideoUrl, cameraReady])

  function handleStartSession() {
    revokeAllBlobUrls()
    setRecordedVideoUrl(null)
    setCurrentQuestionIndex(0)
    setRecordingState("idle")
    setSubmittedAnswers([])
    recordedChunksRef.current = []
    mediaRecorderRef.current = null
    setPhase("live")
  }

  function handleStartRecording() {
    const recordingMountId = liveMountIdRef.current
    setRecorderError(null)
    const stream = mediaStreamRef.current
    if (!stream || typeof MediaRecorder === "undefined") {
      setRecorderError("Perekaman tidak didukung di peramban ini.")
      return
    }

    if (recordedVideoUrl) {
      revokeBlobUrl(recordedVideoUrl)
      setRecordedVideoUrl(null)
    }

    recordedChunksRef.current = []

    let recorder: MediaRecorder
    try {
      const mimeType = pickRecorderMimeType()
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
    } catch {
      setRecorderError("Tidak dapat memulai perekaman.")
      return
    }

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      if (recordingMountId !== liveMountIdRef.current) {
        recordedChunksRef.current = []
        return
      }

      const chunks = recordedChunksRef.current
      const blobType = recorder.mimeType || "video/webm"
      const blob =
        chunks.length > 0 ? new Blob(chunks, { type: blobType }) : new Blob([], { type: blobType })

      if (blob.size === 0) {
        setRecorderError("Rekaman kosong. Coba lagi.")
        setRecordingState("idle")
        mediaRecorderRef.current = null
        return
      }

      const url = URL.createObjectURL(blob)
      trackBlobUrl(url)
      setRecordedVideoUrl(url)
      setRecordingState("stopped")
      mediaRecorderRef.current = null
    }

    recorder.onerror = () => {
      if (recordingMountId !== liveMountIdRef.current) return
      setRecorderError("Terjadi kesalahan saat merekam.")
      setRecordingState("idle")
      mediaRecorderRef.current = null
    }

    mediaRecorderRef.current = recorder
    try {
      recorder.start()
      setRecordingState("recording")
    } catch {
      setRecorderError("Tidak dapat memulai perekaman.")
      mediaRecorderRef.current = null
    }
  }

  function handleStopRecording() {
    const rec = mediaRecorderRef.current
    if (!rec || rec.state === "inactive") return
    if (rec.state === "recording") {
      rec.stop()
    }
  }

  function handleRetryRecording() {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== "inactive") {
      rec.stop()
    }
    mediaRecorderRef.current = null
    recordedChunksRef.current = []

    if (recordedVideoUrl) {
      revokeBlobUrl(recordedVideoUrl)
      setRecordedVideoUrl(null)
    }

    setRecordingState("idle")
    setRecorderError(null)
  }

  function handleSubmitAnswer() {
    if (!recordedVideoUrl) return

    setSubmittedAnswers((prev) => [...prev, recordedVideoUrl])
    setRecordedVideoUrl(null)
    setRecordingState("idle")
    recordedChunksRef.current = []
    mediaRecorderRef.current = null
    setRecorderError(null)

    if (currentQuestionIndex >= totalQuestions - 1) {
      setPhase("completed")
      return
    }
    setCurrentQuestionIndex((i) => i + 1)
  }

  const recorderSupported = typeof MediaRecorder !== "undefined"
  const canStartRecording =
    recordingState === "idle" &&
    !recordedVideoUrl &&
    cameraReady &&
    recorderSupported &&
    !!mediaStreamRef.current
  const canStopRecording = recordingState === "recording"
  const canRetryRecording = recordedVideoUrl !== null
  const canSubmitAnswer = recordedVideoUrl !== null

  const showLivePreview = !recordedVideoUrl

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
        {phase === "overview" ? (
          <>
            <section className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
                Sesi Wawancara
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                Tinjau pertanyaan sebelum memulai
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
                Setelah memulai, Anda akan menjawab satu per satu secara berurutan. Siapkan diri Anda
                di area yang tenang dan pastikan kamera serta mikrofon siap digunakan saat integrasi
                aktif nanti.
              </p>
            </section>

            <section className="mt-10 space-y-4">
              <h2 className="text-sm font-medium text-[#334155]">
                Daftar pertanyaan ({totalQuestions})
              </h2>
              <ol className="space-y-3">
                {MOCK_QUESTIONS.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-[24px] border border-[#E2E8F0] bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F172A]/10 text-sm font-semibold text-[#0F172A]">
                        {i + 1}
                      </span>
                      <p className="text-base leading-7 text-[#334155]">{q}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleStartSession}
                className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
              >
                Mulai Sesi
              </button>
              <Link
                to="/session/setup"
                className="rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
              >
                Kembali ke Persiapan
              </Link>
            </div>
          </>
        ) : null}

        {phase === "live" ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
            <section className="rounded-[32px] border border-[#E2E8F0] bg-white/90 p-8 shadow-sm backdrop-blur lg:p-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#475569]">
                  Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
                </p>
                <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#E2E8F0] sm:max-w-[200px]">
                  <div
                    className="h-full rounded-full bg-[#C9A227]/90 transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <h1 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-[#0F172A] sm:text-2xl sm:leading-9">
                {currentQuestion}
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#64748B]">
                Jawab dengan jelas dan tenang. Pandang kamera saat berbicara agar terasa natural.
              </p>

              {recorderError ? (
                <p className="mt-4 text-sm text-[#B45309]" role="alert">
                  {recorderError}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!canStartRecording}
                  onClick={handleStartRecording}
                  className="rounded-full bg-[#0F172A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Start Recording
                </button>
                <button
                  type="button"
                  disabled={!canStopRecording}
                  onClick={handleStopRecording}
                  className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Stop Recording
                </button>
                <button
                  type="button"
                  disabled={!canRetryRecording}
                  onClick={handleRetryRecording}
                  className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Retry Recording
                </button>
                <button
                  type="button"
                  disabled={!canSubmitAnswer}
                  onClick={handleSubmitAnswer}
                  className="rounded-full bg-[#C9A227] px-5 py-2.5 text-sm font-medium text-[#0F172A] shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Answer
                </button>
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white/90 shadow-sm backdrop-blur">
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0]/80">
                  {recordedVideoUrl ? (
                    <video
                      key={recordedVideoUrl}
                      src={recordedVideoUrl}
                      controls
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                      aria-label="Pratinjau rekaman jawaban"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 [transform:scaleX(-1)] ${
                        cameraReady ? "opacity-100" : "opacity-0"
                      }`}
                      autoPlay
                      muted
                      playsInline
                      aria-label="Pratinjau kamera langsung"
                    />
                  )}
                  {showLivePreview && !cameraReady && !cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6">
                      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[#CBD5E1] border-t-[#C9A227]" />
                      <p className="text-center text-sm font-medium text-[#64748B]">
                        Menyiapkan kamera…
                      </p>
                    </div>
                  ) : null}
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#CBD5E1] bg-white/90 text-[#94A3B8]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-8 w-8"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                      </div>
                      <p className="max-w-[16rem] text-sm leading-6 text-[#475569]">{cameraError}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wider text-[#7C6312]">
                  Status rekaman
                </p>
                <p className="mt-1 text-sm font-medium text-[#0F172A]">
                  {recordedVideoUrl
                    ? "Tinjau rekaman — putar ulang jika perlu"
                    : recordingState === "recording"
                      ? "Sedang merekam…"
                      : "Belum merekam"}
                </p>
              </div>
            </aside>
          </div>
        ) : null}

        {phase === "completed" ? (
          <section className="rounded-[32px] border border-[#E2E8F0] bg-white/90 px-8 py-16 text-center shadow-sm backdrop-blur lg:px-12 lg:py-20">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7C6312]">
              Sesi selesai
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
              Terima kasih telah menyelesaikan simulasi
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#475569]">
              {submittedAnswers.length} jawaban simulasi telah dikirim. Mengalihkan Anda ke ringkasan
              hasil…
            </p>
          </section>
        ) : null}
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-center px-5 py-8 text-center text-xs text-[#64748B]">
        <span>© {new Date().getFullYear()} VagmiAI</span>
      </footer>
    </div>
  )
}

export default SessionLive
