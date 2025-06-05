// Utility for connecting to FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadCV(file: File, signal?: AbortSignal) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/cv/upload`, {
    method: 'POST',
    body: formData,
    signal,
  });
  if (!res.ok) throw new Error('Failed to upload CV');
  return res.json();
}

export async function parseCV(filename: string, signal?: AbortSignal) {
  const res = await fetch(`${API_BASE_URL}/cv/parse/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
    signal,
  });
  if (!res.ok) throw new Error('Failed to parse CV');
  return res.json();
}

export async function compareCVRAG(filename: string, user_id: string, embedding: number[] = []) {
  const res = await fetch(`${API_BASE_URL}/cv/rag/compare/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, user_id, embedding }),
  });
  if (!res.ok) throw new Error('Failed to compare CV with RAG');
  return res.json();
}

// Add more API utilities as needed
