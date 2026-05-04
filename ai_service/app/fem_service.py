import os
import tempfile
import cv2
import numpy as np
from collections import Counter
from transformers import pipeline
from .config import FEM_MODEL_NAME, FEM_DEVICE, MAX_FEM_FRAMES

_clf = None

# Raw emotion → sentiment group
SENTIMENT_MAP = {
    "happy": "positive",
    "surprise": "positive",
    "neutral": "neutral",
    "sad": "negative",
    "angry": "negative",
    "fear": "negative",
    "disgust": "negative",
}

# Scoring weights: positive=high, neutral=mid, negative=low
SENTIMENT_SCORE = {
    "positive": 90,
    "neutral": 60,
    "negative": 30,
}


def get_fem_model():
    global _clf
    if _clf is None:
        _clf = pipeline(
            "image-classification",
            model=FEM_MODEL_NAME,
            device=FEM_DEVICE,
        )
    return _clf


def sample_frames_from_video(video_path: str, max_frames: int = 10):
    """
    Sample up to max_frames evenly-spaced frames from a video file.
    Returns a list of RGB numpy arrays.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames <= 0:
        cap.release()
        return []

    # Evenly space up to max_frames indices
    indices = set(
        int(i * total_frames / max_frames)
        for i in range(max_frames)
    )

    frames = []
    for idx in sorted(indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append((idx, rgb))

    cap.release()
    return frames


def process_fem(video_path: str, frame_interval: int = 15) -> dict:
    """
    Legacy path-based FEM (kept for backward compat with old endpoints).
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    clf = get_fem_model()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Cannot open video")

    frames = []
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % frame_interval == 0:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(rgb)
        idx += 1
    cap.release()

    if not frames:
        raise ValueError("No frames extracted from video")

    grouped = []
    for frame in frames:
        preds = clf(frame)
        if preds:
            label = preds[0]["label"].lower()
            grouped.append(SENTIMENT_MAP.get(label, "neutral"))

    if not grouped:
        raise ValueError("No valid FEM predictions generated")

    counts = Counter(grouped)
    total = sum(counts.values())

    return {
        "dominant_expression": counts.most_common(1)[0][0],
        "positive_percentage": round((counts.get("positive", 0) / total) * 100, 2),
        "neutral_percentage": round((counts.get("neutral", 0) / total) * 100, 2),
        "negative_percentage": round((counts.get("negative", 0) / total) * 100, 2),
    }


def process_fem_from_bytes(video_bytes: bytes, max_frames: int = 10) -> dict:
    """
    FEM inference from uploaded video bytes.
    Returns the new response schema expected by Express.
    """
    suffix = ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(video_bytes)
        tmp_path = tmp.name

    try:
        return process_fem_from_path(tmp_path, max_frames)
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


def process_fem_from_path(video_path: str, max_frames: int = 10) -> dict:
    """
    FEM inference from a file path.
    Returns the new response schema expected by Express.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    clf = get_fem_model()
    indexed_frames = sample_frames_from_video(video_path, max_frames)

    if not indexed_frames:
        raise ValueError("No frames could be extracted from the video")

    frame_results = []
    all_emotions = []
    all_confidences = []

    for frame_idx, frame in indexed_frames:
        preds = clf(frame)
        if not preds:
            continue

        # Build scores dict from all predictions
        scores = {p["label"].lower(): round(float(p["score"]), 4) for p in preds}
        dominant_raw = preds[0]["label"].lower()
        confidence = float(preds[0]["score"])

        frame_results.append(
            {
                "frame_index": frame_idx,
                "dominant_emotion": dominant_raw,
                "scores": scores,
            }
        )
        all_emotions.append(dominant_raw)
        all_confidences.append(confidence)

    if not frame_results:
        raise ValueError("No valid FEM predictions generated")

    # Aggregate
    emotion_counts = Counter(all_emotions)
    total = sum(emotion_counts.values())
    emotion_distribution = {
        em: round((cnt / total) * 100, 2)
        for em, cnt in emotion_counts.items()
    }

    dominant_emotion = emotion_counts.most_common(1)[0][0]
    confidence_average = round(sum(all_confidences) / len(all_confidences), 4)

    # Compute expression score (0-100) based on sentiment of dominant emotion
    dominant_sentiment = SENTIMENT_MAP.get(dominant_emotion, "neutral")
    base_score = SENTIMENT_SCORE.get(dominant_sentiment, 60)

    # Weight by confidence
    expression_score = round(
        base_score * 0.7 + confidence_average * 100 * 0.3, 2
    )
    expression_score = max(0.0, min(100.0, expression_score))

    return {
        "dominant_emotion": dominant_emotion,
        "emotion_distribution": emotion_distribution,
        "frame_results": frame_results,
        "confidence_average": confidence_average,
        "expression_score": expression_score,
    }