# summarizer.py
import re
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# ✅ Load embedding model once at startup
print("[summarizer] Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")  # lightweight & fast
print("[summarizer] Model loaded ✅")

# ------------------- TEXT CLEANING ------------------- #
def clean_text(text: str) -> str:
    """Remove extra spaces and normalize transcript text."""
    return re.sub(r'\s+', ' ', text).strip()

# ------------------- CHUNKING ------------------- #
def chunk_text(text: str, max_chunk_length: int = 200) -> list[str]:
    """Split transcript into manageable chunks based on sentence boundaries."""
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks, current_chunk, current_length = [], [], 0

    for sentence in sentences:
        words = sentence.split()
        if current_length + len(words) > max_chunk_length and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk, current_length = [], 0
        current_chunk.extend(words)
        current_length += len(words)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

# ------------------- SUMMARIZATION CORE ------------------- #
def summarize_text(transcript: str, top_k: int = 5) -> str:
    """
    Summarize transcript by selecting top-k representative chunks using vector embeddings.
    """
    transcript = clean_text(transcript)
    chunks = chunk_text(transcript)

    # If transcript is already short, return as-is
    if len(chunks) <= top_k:
        return transcript

    # Compute embeddings
    embeddings = model.encode(chunks, convert_to_numpy=True).astype("float32")

    # Build FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    # Compute centroid vector & retrieve top-k closest chunks
    centroid = np.mean(embeddings, axis=0).reshape(1, -1)
    _, indices = index.search(centroid, top_k)

    selected_chunks = [chunks[i] for i in indices[0]]
    summary = " ".join(selected_chunks)
    return clean_text(summary)
