# ChromaDB and RAG integration utilities for PORTMAN
import os
from typing import List, Dict
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "portman-cv-collection")
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", os.path.join(os.path.dirname(__file__), "../database/chroma"))

# Initialize ChromaDB client and collection
_client = chromadb.Client(Settings(persist_directory=CHROMA_PERSIST_DIR))
def _get_chroma_collection():
    try:
        if CHROMA_COLLECTION not in [c.name for c in _client.list_collections()]:
            _client.create_collection(name=CHROMA_COLLECTION, metadata={"hnsw:space": "cosine"})
        return _client.get_collection(name=CHROMA_COLLECTION)
    except Exception as e:
        print(f"Warning: Could not connect to ChromaDB: {e}")
        return None

def upsert_cv_embedding(user_id: str, embedding: List[float]):
    if len(embedding) != 1536:
        if len(embedding) < 1536:
            embedding = embedding + [0.0] * (1536 - len(embedding))
        else:
            embedding = embedding[:1536]
    try:
        collection = _get_chroma_collection()
        if collection is None:
            return {"error": "ChromaDB not available"}
        # Chroma expects embeddings as a list of lists
        collection.upsert(ids=[user_id], embeddings=[embedding], metadatas=[{"user_id": user_id}])
        return {"upserted": user_id}
    except Exception as e:
        return {"error": f"Failed to upsert: {str(e)}"}

def query_similar_professionals(embedding: List[float], top_k: int = 5) -> dict:
    try:
        collection = _get_chroma_collection()
        if collection is None:
            return {"error": "ChromaDB not available"}
        # Chroma expects embeddings as a list of lists
        results = collection.query(query_embeddings=[embedding], n_results=top_k, include=["metadatas", "distances"])
        return {"results": results}
    except Exception as e:
        return {"error": f"Could not query ChromaDB: {str(e)}"}

def get_professional_benchmark(cv_data: Dict) -> Dict:
    return {"benchmark": "This is a simulated benchmark result."}
