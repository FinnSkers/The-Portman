import requests
import os

icon_map = {
    "8bit-cv.png": "https://img.icons8.com/pastel-glyph/64/000000/resume.png",
    "8bit-ats.png": "https://img.icons8.com/pastel-glyph/64/000000/robot-2--v2.png",
    "8bit-rag.png": "https://img.icons8.com/pastel-glyph/64/000000/brain--v2.png",
    "8bit-portfolio.png": "https://img.icons8.com/pastel-glyph/64/000000/portfolio--v2.png",
    "8bit-career.png": "https://img.icons8.com/pastel-glyph/64/000000/businessman--v2.png",
    "8bit-avatar1.png": "https://img.icons8.com/pastel-glyph/64/000000/person-male--v2.png",
    "8bit-avatar2.png": "https://img.icons8.com/pastel-glyph/64/000000/person-female--v2.png",
    "8bit-mascot.png": "https://img.icons8.com/pastel-glyph/64/000000/alien.png"
}

output_dir = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(output_dir, exist_ok=True)

for filename, url in icon_map.items():
    response = requests.get(url)
    if response.status_code == 200:
        with open(os.path.join(output_dir, filename), "wb") as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
    else:
        print(f"Failed to download {filename} from {url}")
