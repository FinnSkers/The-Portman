# Vector embedding and RAG pipeline integration for PORTMAN
import os
from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '../backend/.env'))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "your-pinecone-api-key")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "portman-cv-index")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")

# Initialize Pinecone client (new SDK)
pc = Pinecone(api_key=PINECONE_API_KEY)

# Ensure index exists
if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_REGION)
    )
index = pc.Index(PINECONE_INDEX)

def upsert_cv_embedding(user_id: str, embedding: List[float]):
    if len(embedding) != 1536:
        if len(embedding) < 1536:
            embedding = embedding + [0.0] * (1536 - len(embedding))
        else:
            embedding = embedding[:1536]
    try:
        index.upsert(vectors=[{"id": user_id, "values": embedding}])
        return {"upserted": user_id}
    except Exception as e:
        return {"error": f"Failed to upsert: {str(e)}"}

def query_similar_professionals(embedding: List[float], top_k: int = 5) -> dict:
    try:
        results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
        return {"results": str(results)}
    except Exception as e:
        return {"error": f"Could not query Pinecone: {str(e)}"}

def get_professional_benchmark(cv_data: Dict) -> Dict:
    # Placeholder: In production, compare with real professional datasets
    return {"benchmark": "This is a simulated benchmark result."}
