import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Session } from "../models/session.model.js";
import { SessionAnswer } from "../models/sessionAnswer.model.js";
import {
  getVideoDir,
  buildMediaFilename,
  ensureMediaDirs,
} from "../services/media.service.js";
import { enqueueProcessAnswerJob } from "../jobs/processAnswer.job.js";

/**
 * POST /api/answers/submit
 * multipart/form-data: sessionId, questionId, questionNumber, questionText, video (file)
 */
export const submitAnswer = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── 1. Validate fields ────────────────────────────────────────────────
    const { sessionId, questionId, questionNumber, questionText } = req.body;

    if (!sessionId || !mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ success: false, message: "Invalid sessionId." });
    }
    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required." });
    }
    if (!questionNumber || isNaN(Number(questionNumber))) {
      return res.status(400).json({ success: false, message: "questionNumber is required." });
    }
    if (!questionText) {
      return res.status(400).json({ success: false, message: "questionText is required." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file uploaded." });
    }

    const qNum = Number(questionNumber);

    // ── 2. Validate session belongs to user ───────────────────────────────
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found or access denied." });
    }

    // ── 3. Validate questionId/questionNumber exist in session ────────────
    const matchedQuestion = session.generatedQuestions.find(
      (q) => q.questionId === questionId && q.questionNumber === qNum
    );
    if (!matchedQuestion) {
      return res.status(400).json({
        success: false,
        message: `Question ${questionNumber} (id: ${questionId}) not found in this session.`,
      });
    }

    // ── 4. Create SessionAnswer doc first to get answerId ─────────────────
    let answerDoc;
    try {
      answerDoc = await SessionAnswer.findOneAndUpdate(
        { sessionId, questionNumber: qNum },
        {
          $setOnInsert: {
            sessionId,
            userId,
            questionId,
            questionNumber: qNum,
            questionText,
            processingStatus: "queued",
            processingError: "",
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      // If duplicate key — another request already created it; fetch it
      if (err.code === 11000) {
        answerDoc = await SessionAnswer.findOne({ sessionId, questionNumber: qNum });
      } else {
        throw err;
      }
    }

    const answerId = answerDoc._id.toString();

    // ── 5. Save video to shared_data/video ───────────────────────────────
    ensureMediaDirs();
    const ext =
      req.file.originalname.match(/\.(webm|mp4|mov|mkv|ogv)$/i)?.[1] ?? "webm";
    const videoFilename = buildMediaFilename(sessionId, answerId, qNum, ext);
    const videoAbsPath = path.join(getVideoDir(), videoFilename);

    fs.writeFileSync(videoAbsPath, req.file.buffer);

    const videoRelPath = path.join("shared_data", "video", videoFilename);

    // ── 6. Update answer with video path + reset status ──────────────────
    await SessionAnswer.findByIdAndUpdate(answerId, {
      videoPath: videoRelPath,
      processingStatus: "queued",
      processingError: "",
      transcript: "",
      asrMetadata: null,
      femResult: null,
      femSummary: "",
      answerEvaluation: null,
      answerScore: null,
      communicationScore: null,
      expressionScore: null,
      overallQuestionScore: null,
      optimalAnswer: "",
    });

    // ── 7. Update session status to "processing" ─────────────────────────
    await Session.findByIdAndUpdate(sessionId, { status: "processing" });

    // ── 8. Enqueue Agenda job ─────────────────────────────────────────────
    await enqueueProcessAnswerJob({
      answerId,
      sessionId,
      userId: userId.toString(),
      questionNumber: qNum,
    });

    // ── 9. Return immediately ─────────────────────────────────────────────
    return res.status(202).json({
      success: true,
      message: "Answer uploaded and queued for processing.",
      answerId,
      sessionId,
      questionNumber: qNum,
      processingStatus: "queued",
    });
  } catch (error) {
    console.error("submitAnswer error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit answer.",
    });
  }
};

/**
 * GET /api/answers/:answerId
 * Returns processing status and result for one answer.
 */
export const getAnswerById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answerId } = req.params;

    if (!mongoose.isValidObjectId(answerId)) {
      return res.status(400).json({ success: false, message: "Invalid answerId." });
    }

    const answer = await SessionAnswer.findOne({ _id: answerId, userId });
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found or access denied." });
    }

    return res.status(200).json({ success: true, data: answer });
  } catch (error) {
    console.error("getAnswerById error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
