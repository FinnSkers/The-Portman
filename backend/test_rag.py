import os
import sys
import pytest
from fastapi.testclient import TestClient
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))
from main import app

client = TestClient(app)

def test_rag_compare():
    # Simulate upload first
    with open("test_cv.txt", "w") as f:
        f.write("Name: Alex Roe\nEmail: alex@example.com\nSkills: NLP, AI")
    with open("test_cv.txt", "rb") as f:
        client.post("/cv/upload/", files={"file": ("test_cv.txt", f, "text/plain")})
    payload = {
        "filename": "test_cv.txt",
        "user_id": "test_user",
        "embedding": [0.1, 0.2, 0.3]
    }
    response = client.post("/cv/rag/compare/", json=payload)
    os.remove("uploaded_cvs/test_cv.txt")
    assert response.status_code == 200
    assert "upsert" in response.json()
    assert "similar_professionals" in response.json()
    assert "benchmark" in response.json()
