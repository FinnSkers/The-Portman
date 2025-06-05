# PORTMAN AI Services

This folder contains AI model integrations and pipelines for CV parsing, RAG-based professional comparison, and benchmarking.

## Structure
- `cv_ai.py`: Integrates DeepSeek-R1, Groq, and OpenRouter APIs for CV parsing.
- `vector_rag.py`: Handles vector embedding, Pinecone integration, and RAG pipeline for professional comparison.

## Usage
- Import `parse_cv_with_ai` from `ai-services/cv_ai.py` in your backend for AI-powered CV parsing.
- Import `upsert_cv_embedding`, `query_similar_professionals`, and `get_professional_benchmark` from `ai-services/vector_rag.py` for vector search and RAG features.

---

See the main project README for architecture and usage details.
