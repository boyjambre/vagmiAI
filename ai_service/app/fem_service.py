import os
import cv2
from collections import Counter
from transformers import pipeline
from .config import FEM_MODEL_NAME, FEM_DEVICE

_clf = None

EMOTION_MAP = {
    "happy": "positive",
    "surprise": "positive",
    "neutral": "neutral",
    "sad": "negative",
    "angry": "negative",
    "fear": "negative",
    "disgust": "negative",
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


def sample_frames(video_path: str, frame_interval: int = 15):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

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
    return frames


def process_fem(video_path: str, frame_interval: int = 15) -> dict:
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    clf = get_fem_model()
    frames = sample_frames(video_path, frame_interval)

    if not frames:
        raise ValueError("No frames extracted from video")

    grouped_predictions = []

    for frame in frames:
        preds = clf(frame)
        if not preds:
            continue

        label = preds[0]["label"].lower()
        grouped_predictions.append(EMOTION_MAP.get(label, "neutral"))

    if not grouped_predictions:
        raise ValueError("No valid FEM predictions generated")

    counts = Counter(grouped_predictions)
    total = sum(counts.values())

    return {
        "dominant_expression": counts.most_common(1)[0][0],
        "positive_percentage": round((counts.get("positive", 0) / total) * 100, 2),
        "neutral_percentage": round((counts.get("neutral", 0) / total) * 100, 2),
        "negative_percentage": round((counts.get("negative", 0) / total) * 100, 2),
    }