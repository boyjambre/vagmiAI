import os
from faster_whisper import WhisperModel
from .config import (
    ASR_MODEL_NAME,
    ASR_DEVICE,
    ASR_COMPUTE_TYPE,
    ASR_BEAM_SIZE,
    ASR_USE_VAD,
    ASR_LANGUAGE,
)

_model = None


def get_asr_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            ASR_MODEL_NAME,
            device=ASR_DEVICE,
            compute_type=ASR_COMPUTE_TYPE,
        )
    return _model


def process_asr(audio_path: str, language: str | None = None) -> dict:
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    model = get_asr_model()
    used_language = language or ASR_LANGUAGE

    segments, info = model.transcribe(
        audio_path,
        language=used_language,
        beam_size=ASR_BEAM_SIZE,
        vad_filter=ASR_USE_VAD,
        condition_on_previous_text=False,
    )

    transcript_text = " ".join(
        segment.text.strip() for segment in segments
    ).strip()

    return {
        "transcript_text": transcript_text,
        "language": used_language,
        "duration_seconds": getattr(info, "duration", None),
    }