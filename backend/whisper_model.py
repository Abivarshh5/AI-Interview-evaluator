"""
Transcription helper: tries to use whisper (openai-whisper) if installed.
If not available, falls back to a simple placeholder return.
Set environment variable USE_WHISPER=true to attempt Whisper use.
"""
import os

USE_WHISPER = os.getenv("USE_WHISPER", "true").lower() in ("1","true","yes")

def transcribe_audio(filepath):
    # Try real whisper first
    if USE_WHISPER:
        try:
            import whisper
            model_name = os.getenv("WHISPER_MODEL", "small")  # small/medium/base etc
            model = whisper.load_model(model_name)
            result = model.transcribe(filepath)
            return result.get("text", "").strip()
        except Exception as e:
            # log but continue to fallback
            print("Whisper error or not installed:", e)

    # fallback simple: return filename or placeholder
    # If ffmpeg and speech_recognition are available you can replace with more advanced fallback.
    fname = os.path.basename(filepath)
    return f"[transcription placeholder for {fname} — install OpenAI Whisper for real transcripts]"
