from fastapi import FastAPI, HTTPException
from .config import APP_NAME, APP_ENV
from .schemas import (
    ASRJobRequest,
    ASRJobResponse,
    FEMJobRequest,
    FEMJobResponse,
)
from .asr_service import process_asr
from .fem_service import process_fem

app = FastAPI(
    title=APP_NAME,
    version="1.0.0",
    description="AI inference service for ASR and FEM jobs",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": APP_NAME,
        "environment": APP_ENV,
    }


@app.post("/jobs/asr/process", response_model=ASRJobResponse)
def process_asr_job(payload: ASRJobRequest):
    try:
        result = process_asr(
            audio_path=payload.audio_path,
            language=payload.language,
        )

        return ASRJobResponse(
            job_id=payload.job_id,
            answer_id=payload.answer_id,
            status="completed",
            transcript_text=result["transcript_text"],
            language=result["language"],
            duration_seconds=result["duration_seconds"],
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jobs/fem/process", response_model=FEMJobResponse)
def process_fem_job(payload: FEMJobRequest):
    try:
        result = process_fem(
            video_path=payload.video_path,
            frame_interval=payload.frame_interval,
        )

        return FEMJobResponse(
            job_id=payload.job_id,
            answer_id=payload.answer_id,
            status="completed",
            dominant_expression=result["dominant_expression"],
            positive_percentage=result["positive_percentage"],
            neutral_percentage=result["neutral_percentage"],
            negative_percentage=result["negative_percentage"],
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))