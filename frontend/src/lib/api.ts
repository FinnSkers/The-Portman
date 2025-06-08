// Minimal API client for CV upload and parsing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function uploadCV(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  // Force correct endpoint for backend: /api/v1/cv/upload/
  const res = await fetch(`/api/v1/cv/upload/`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // returns { filename, status }
}

export async function parseCV(filename: string) {
  // Backend expects POST with JSON { filename }
  const res = await fetch(`${API_BASE_URL}/cv/parse/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) throw new Error('Parse failed');
  return res.json();
}
