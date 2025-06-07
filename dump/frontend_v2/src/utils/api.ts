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

export async function analyzeCVRAG(cv_data: any) {
  const res = await fetch(`${API_BASE_URL}/cv/rag/analyze/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cv_data }),
  });
  if (!res.ok) throw new Error('Failed to analyze CV with RAG');
  return res.json();
}

// ATS Resume Maker API functions
export async function getATSTemplates() {
  const res = await fetch(`${API_BASE_URL}/api/v1/ats/templates/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch ATS templates');
  return res.json();
}

export async function analyzeATSCompatibility(cv_data: any, target_job_title?: string) {
  const params = new URLSearchParams();
  if (target_job_title) params.append('target_job_title', target_job_title);
  
  const res = await fetch(`${API_BASE_URL}/api/v1/ats/analyze/?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cv_data),
  });
  if (!res.ok) throw new Error('Failed to analyze ATS compatibility');
  return res.json();
}

export async function generateATSResume(requestData: {
  cv_data: any;
  template_type: string;
  include_sections?: string[];
  keyword_optimization?: boolean;
  target_job_title?: string;
  target_industry?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/v1/ats/generate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  if (!res.ok) throw new Error('Failed to generate ATS resume');
  return res.json();
}

export async function downloadATSResume(resumeId: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/ats/download/${resumeId}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to download ATS resume');
  return res.blob();
}

// Add more API utilities as needed
