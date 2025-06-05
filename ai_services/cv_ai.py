# AI-powered CV parsing and integration for PORTMAN
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

OPENROUTER_API_URL = os.getenv('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
OPENROUTER_MODEL = os.getenv('OPENROUTER_MODEL', 'deepseek/deepseek-r1-0528-qwen3-8b:free')
GROQ_API_URL = os.getenv('GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions')
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.1-8b-instant')

def parse_cv_with_ai(text_content: str) -> dict:
    print("[parse_cv_with_ai] Called with text length:", len(text_content))
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
        print("[parse_cv_with_ai] Sending to OpenRouter:", data)
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=data, timeout=30)
        print("[parse_cv_with_ai] OpenRouter status:", response.status_code)
        if response.status_code == 200:
            result = response.json()
            print("[parse_cv_with_ai] OpenRouter result:", result)
            ai_content = result['choices'][0]['message']['content']
            try:
                parsed = json.loads(ai_content)
            except Exception:
                # Try to extract JSON from markdown/code block or raw string
                import re
                match = re.search(r'```json\s*([\s\S]+?)```', ai_content)
                if match:
                    try:
                        parsed = json.loads(match.group(1))
                    except Exception:
                        parsed = {"raw": ai_content}
                else:
                    # Try to find first curly brace and last curly brace and parse
                    brace_start = ai_content.find('{')
                    brace_end = ai_content.rfind('}')
                    if brace_start != -1 and brace_end != -1 and brace_end > brace_start:
                        try:
                            parsed = json.loads(ai_content[brace_start:brace_end+1])
                        except Exception:
                            parsed = {"raw": ai_content}
                    else:
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
        print("[parse_cv_with_ai] Sending to Groq:", data)
        response = requests.post(GROQ_API_URL, headers=headers, json=data, timeout=30)
        print("[parse_cv_with_ai] Groq status:", response.status_code)
        if response.status_code == 200:
            result = response.json()
            print("[parse_cv_with_ai] Groq result:", result)
            ai_content = result['choices'][0]['message']['content']
            try:
                parsed = json.loads(ai_content)
            except Exception:
                parsed = {"raw": ai_content}
            return {"parsed_data": parsed, "status": "success"}
    except Exception as e:
        print(f"Groq failed: {e}")
    return {"error": "Could not parse CV with AI"}
