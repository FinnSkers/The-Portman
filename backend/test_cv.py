import os
import sys
import pytest
from fastapi.testclient import TestClient
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))
from main import app

client = TestClient(app)

def test_upload_cv_pdf():
    with open("test_cv.pdf", "wb") as f:
        f.write(b"%PDF-1.4 test pdf content")
    with open("test_cv.pdf", "rb") as f:
        response = client.post("/cv/upload/", files={"file": ("test_cv.pdf", f, "application/pdf")})
    os.remove("test_cv.pdf")
    assert response.status_code == 200
    assert response.json()["status"] == "uploaded"

def test_upload_cv_invalid():
    with open("test_cv.exe", "wb") as f:
        f.write(b"MZ fake exe content")
    with open("test_cv.exe", "rb") as f:
        response = client.post("/cv/upload/", files={"file": ("test_cv.exe", f, "application/octet-stream")})
    os.remove("test_cv.exe")
    assert response.status_code == 400

def test_parse_cv():
    # Simulate upload first
    with open("test_cv.txt", "w") as f:
        f.write("Name: Alex Roe\nEmail: alex@example.com\nSkills: NLP, AI")
    with open("test_cv.txt", "rb") as f:
        client.post("/cv/upload/", files={"file": ("test_cv.txt", f, "text/plain")})
    response = client.post("/cv/parse/", json={"filename": "test_cv.txt"})
    os.remove("uploaded_cvs/test_cv.txt")
    assert response.status_code == 200
    assert response.json()["parsed_data"]["name"] == "Alex Roe"
