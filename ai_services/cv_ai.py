# AI-powered CV parsing and integration for PORTMAN
import os
import requests
import json

OPENROUTER_API_URL = os.getenv('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
OPENROUTER_MODEL = os.getenv('OPENROUTER_MODEL', 'deepseek/deepseek-r1-0528-qwen3-8b:free')
GROQ_API_URL = os.getenv('GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions')
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.1-8b-instant')

def parse_cv_with_ai(text_content: str) -> dict:
    """Parse CV text using OpenRouter/DeepSeek-R1 or Groq."""
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
                parsed = json.loads(ai_content)
            except Exception:
                parsed = {"raw": ai_content}
            return {"parsed_data": parsed, "status": "success"}
    except Exception as e:
        print(f"OpenRouter failed: {e}")
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
                parsed = json.loads(ai_content)
            except Exception:
                parsed = {"raw": ai_content}
            return {"parsed_data": parsed, "status": "success"}
    except Exception as e:
        print(f"Groq failed: {e}")
    return {"error": "Could not parse CV with AI"}
