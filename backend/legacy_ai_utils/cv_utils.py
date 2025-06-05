import os
from typing import Dict
import requests
import PyPDF2
from docx import Document

OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
OPENROUTER_API_KEY = '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'
OPENROUTER_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b:free'
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
GROQ_API_KEY = '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'
GROQ_MODEL = 'llama-3.1-8b-instant'

# Placeholder for actual AI integration
# In production, use requests or httpx to call OpenRouter, DeepSeek-R1, Groq APIs

def extract_text_from_file(file_path: str) -> str:
    """Extract text from PDF, DOCX, or TXT files."""
    ext = file_path.split(".")[-1].lower()
    
    try:
        if ext == "pdf":
            with open(file_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        elif ext == "docx":
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        elif ext == "txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
                return file.read()
        else:
            # Fallback: try to read as text
            with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
                return file.read()
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

def parse_cv_with_ai(file_path: str) -> dict:
    import requests
    import json as _json
    
    # Extract text from the file
    text_content = extract_text_from_file(file_path)
    if not text_content.strip():
        return {"filename": os.path.basename(file_path), "parsed_data": {"error": "Could not extract text from file"}, "status": "error"}
    
    # Try OpenRouter/DeepSeek-R1 first
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": "You are a CV parser. Extract all possible structured fields (name, email, phone, address, education, experience, skills, languages, certifications, links, summary, etc.) as a JSON object. Return only valid JSON."},
                {"role": "user", "content": f"Parse this CV text:\n\n{text_content}"}
            ]
        }
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            result = response.json()
            ai_content = result['choices'][0]['message']['content']
            try:
                parsed = _json.loads(ai_content)
            except Exception:
                parsed = {"raw": ai_content}
            return {"filename": os.path.basename(file_path), "parsed_data": parsed, "status": "success"}
    except Exception as e:
        print(f"OpenRouter failed: {e}")
        pass  # Fallback to Groq
    # Fallback to Groq
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are a CV parser. Extract all possible structured fields (name, email, phone, address, education, experience, skills, languages, certifications, links, summary, etc.) as a JSON object. Support all file types."},
                {"role": "user", "content": f"Parse this CV text:\n\n{text_content}"}
            ]
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            result = response.json()
            ai_content = result['choices'][0]['message']['content']
            try:
                parsed = _json.loads(ai_content)
            except Exception:
                parsed = {"raw": ai_content}
            return {"filename": os.path.basename(file_path), "parsed_data": parsed, "status": "success"}
    except Exception as e:
        pass    # If all fails, fallback to simple extraction
    lines = text_content.splitlines()
    parsed = {}
    for line in lines:
        if line.lower().startswith("name:"):
            parsed["name"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("email:"):
            parsed["email"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("skills:"):
            parsed["skills"] = [s.strip() for s in line.split(":", 1)[-1].split(",")]
        elif line.lower().startswith("phone:"):
            parsed["phone"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("address:"):
            parsed["address"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("education:"):
            parsed["education"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("experience:"):
            parsed["experience"] = line.split(":", 1)[-1].strip()
        elif line.lower().startswith("languages:"):
            parsed["languages"] = [s.strip() for s in line.split(":", 1)[-1].split(",")]
        elif line.lower().startswith("certifications:"):
            parsed["certifications"] = [s.strip() for s in line.split(":", 1)[-1].split(",")]
        elif line.lower().startswith("links:"):
            parsed["links"] = [s.strip() for s in line.split(":", 1)[-1].split(",")]
        elif line.lower().startswith("summary:"):
            parsed["summary"] = line.split(":", 1)[-1].strip()
    if not parsed:
        parsed = {"error": "Could not extract data from file"}
    return {"filename": os.path.basename(file_path), "parsed_data": parsed, "status": "fallback"}
