import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 * Resolve base shared_data directory.
 * In Docker: SHARED_DATA_DIR=/data  →  /data/video  /data/audio
 * Locally: falls back to ../shared_data relative to backend cwd.
 */
function getSharedDataDir() {
  return (
    process.env.SHARED_DATA_DIR ||
    path.resolve(process.cwd(), "../shared_data")
  );
}

export function getVideoDir() {
  return path.join(getSharedDataDir(), "video");
}

export function getAudioDir() {
  return path.join(getSharedDataDir(), "audio");
}

/** Ensure both media directories exist. */
export function ensureMediaDirs() {
  const videoDir = getVideoDir();
  const audioDir = getAudioDir();
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Build a safe filename for video or audio.
 * Format: session-{sid}_answer-{aid}_q-{qNum}_{ts}.{ext}
 */
export function buildMediaFilename(sessionId, answerId, questionNumber, ext) {
  const ts = Date.now();
  return `session-${sessionId}_answer-${answerId}_q-${questionNumber}_${ts}.${ext}`;
}

/**
 * Extract audio from a video file using ffmpeg.
 * Returns the absolute path to the extracted .wav file.
 */
export function extractAudio(videoAbsPath, audioAbsPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i",
      videoAbsPath,
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "16000",
      "-ac",
      "1",
      audioAbsPath,
    ];

    const proc = spawn("ffmpeg", args);

    let stderr = "";
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(audioAbsPath);
      } else {
        reject(
          new Error(
            `ffmpeg exited with code ${code}. stderr: ${stderr.slice(-500)}`
          )
        );
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`ffmpeg spawn error: ${err.message}`));
    });
  });
}
