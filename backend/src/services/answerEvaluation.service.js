import { callOpenRouter } from "./openRouter.service.js";

const EVAL_MODEL =
  process.env.GEMINI_EVAL_MODEL || "google/gemini-2.5-flash";

/**
 * Build a human-readable FEM summary string from the FEM result object.
 */
function buildFemSummary(femResult) {
  if (!femResult) return "Analisis ekspresi wajah tidak tersedia.";
  const { dominantEmotion, emotionDistribution, confidenceAverage } = femResult;
  const dist = emotionDistribution
    ? Object.entries(emotionDistribution)
        .map(([k, v]) => `${k}: ${v}%`)
        .join(", ")
    : "";
  return (
    `Ekspresi dominan: ${dominantEmotion ?? "tidak diketahui"}. ` +
    (dist ? `Distribusi emosi: ${dist}. ` : "") +
    `Rata-rata confidence: ${confidenceAverage ?? 0}.`
  );
}

/**
 * Evaluate one interview answer using Gemini 2.5 Flash via OpenRouter.
 *
 * @param {object} params
 * @param {string} params.questionText
 * @param {string} params.transcript
 * @param {string} params.jobRole
 * @param {string} params.companyName
 * @param {string} params.cvContext
 * @param {string} params.linksContext
 * @param {object|null} params.femResult
 * @returns {object} Parsed evaluation result
 */
export const evaluateAnswer = async ({
  questionText,
  transcript,
  jobRole,
  companyName,
  cvContext,
  linksContext,
  femResult,
}) => {
  const femSummary = buildFemSummary(femResult);

  const systemPrompt = `Anda adalah evaluator wawancara kerja berbasis AI. Tugas Anda adalah mengevaluasi jawaban kandidat terhadap pertanyaan wawancara.

Berikan evaluasi yang konstruktif, jujur, dan praktis. Fokus pada kualitas jawaban, relevansi, kelengkapan, dan kejelasan komunikasi.

ATURAN PENTING:
- Gunakan Bahasa Indonesia KECUALI jika pertanyaan dan jawaban kandidat jelas dalam Bahasa Inggris.
- Jangan mengarang fakta atau pengalaman yang tidak ada dalam transkrip atau konteks.
- Jika transkrip kosong, sangat pendek, atau tidak relevan, beri skor rendah dan jelaskan alasannya.
- FEM (analisis ekspresi wajah) hanya sebagai bukti pendukung, bukan penentu utama skor.
- Skala skor: 0–100.

Return JSON only, tanpa markdown, penjelasan, atau teks tambahan. Schema wajib:
{
  "answerScore": number,
  "communicationScore": number,
  "expressionScore": number,
  "overallQuestionScore": number,
  "strengths": [string],
  "weaknesses": [string],
  "evaluation": string,
  "improvementSuggestions": [string],
  "optimalAnswer": string
}`;

  const prompt = `Evaluasi jawaban wawancara berikut:

=== INFORMASI POSISI ===
Posisi: ${jobRole || "Tidak disebutkan"}
Perusahaan: ${companyName || "Tidak disebutkan"}

=== PERTANYAAN WAWANCARA ===
${questionText}

=== TRANSKRIP JAWABAN KANDIDAT ===
${transcript || "(Tidak ada transkrip — rekaman mungkin diam atau gagal ditranskripsi)"}

=== KONTEKS CV KANDIDAT ===
${cvContext || "Tidak tersedia."}

=== KONTEKS LOWONGAN / LINK ===
${linksContext || "Tidak tersedia."}

=== HASIL ANALISIS EKSPRESI WAJAH (FEM) ===
${femSummary}

Berikan evaluasi lengkap sesuai schema JSON yang ditentukan.`;

  try {
    const result = await callOpenRouter(prompt, systemPrompt, EVAL_MODEL);

    // Validate and provide safe fallbacks for all required fields
    return {
      answerScore: safeScore(result.answerScore),
      communicationScore: safeScore(result.communicationScore),
      expressionScore: safeScore(result.expressionScore, femResult?.expressionScore),
      overallQuestionScore: safeScore(result.overallQuestionScore),
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      evaluation: result.evaluation ?? "",
      improvementSuggestions: Array.isArray(result.improvementSuggestions)
        ? result.improvementSuggestions
        : [],
      optimalAnswer: result.optimalAnswer ?? "",
      femSummary,
    };
  } catch (error) {
    console.error("Answer evaluation error:", error.message);
    throw error;
  }
};

function safeScore(value, fallback = null) {
  const n = Number(value);
  if (isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}
