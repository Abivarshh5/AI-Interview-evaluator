# evaluator.py
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from summarizer import summarize_text, model  # ✅ import the existing model

print("[evaluator] Evaluator initialized ✅")

# ------------------- EMBEDDING FUNCTION ------------------- #
def get_embedding(text: str) -> np.ndarray:
    emb = model.encode([text], convert_to_numpy=True).astype("float32")
    return emb[0]

# ------------------- COSINE SIMILARITY ------------------- #
def cosine_similarity(vec1, vec2):
    num = np.dot(vec1, vec2)
    denom = np.linalg.norm(vec1) * np.linalg.norm(vec2)
    if denom == 0:
        return 0.0
    return float(num / denom)

# ------------------- MAIN EVALUATION ------------------- #
def evaluate_summary(transcript: str, role_text: str = "") -> dict:
    """
    Generate summary from transcript and compute semantic similarity
    against the expected role_text if provided.
    """
    generated_summary = summarize_text(transcript)

    if not role_text:
        return {
            "summary": generated_summary,
            "similarity_score": None,
            "match_percent": None,
            "message": "No role text provided — similarity skipped."
        }

    # Compute embeddings
    summary_emb = get_embedding(generated_summary)
    role_emb = get_embedding(role_text)
    sim = cosine_similarity(summary_emb, role_emb)
    match_percent = round(sim * 100, 2)

    return {
        "summary": generated_summary,
        "similarity_score": sim,
        "match_percent": match_percent,
        "message": f"Match: {match_percent}%"
    }
