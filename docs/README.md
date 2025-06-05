# PORTMAN - The Portfolio Maker

PORTMAN is an AI-powered platform that transforms CVs into personalized, responsive portfolio websites. It leverages advanced AI parsing, retrieval-augmented generation (RAG) for professional benchmarking, and modern web technologies to streamline personal branding and career growth.

## 🚀 Features

- **AI-Powered CV Parsing:** Extract structured data from PDF, DOCX, and TXT files using DeepSeek-R1, Groq, and OpenRouter APIs.
- **RAG-Enhanced Analysis:** Compare CVs with industry professionals using retrieval-augmented generation and ChromaDB vector search.
- **Automated Website Generation:** Instantly create responsive, modern portfolio websites with template selection.
- **Professional Benchmarking:** Receive AI-driven suggestions by comparing your profile with top professionals in your field.
- **Multi-Format Support:** Handle various CV formats with intelligent preprocessing.
- **Real-time Analytics:** Track portfolio performance and user engagement (planned).
- **Dynamic and 3D Frontend:** Modern, interactive UI/UX with 3D and animated components (in progress).

## 🏗️ Architecture

```
PORTMAN/
├── backend/              # FastAPI (Python) for API, business logic, and AI integration
├── frontend/             # Next.js (React) for SSR, SSG, and dynamic portfolio sites
├── ai-services/          # AI model integrations and pipelines
├── database/             # PostgreSQL for structured data, ChromaDB for vector search
├── templates/            # Website templates (React/Next.js based)
├── docs/                 # Documentation
└── scripts/              # Automation and utilities
```

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python), Celery, PostgreSQL
- **Frontend:** Next.js (React), Tailwind CSS, Three.js/React Three Fiber (planned)
- **AI & ML:** DeepSeek-R1, Groq, OpenRouter, ChromaDB, RAG pipeline
- **Other:** Auth0/NextAuth.js (planned), Vercel/AWS, Plausible/Google Analytics (planned)

## 📝 Usage

### 1. Local Development

#### Backend (FastAPI)
- Install dependencies:
  ```powershell
  cd backend
  pip install -r requirements.txt
  ```
- Set up your `.env` file with API keys (see backend/README.md for details).
- Start the backend server:
  ```powershell
  uvicorn main:app --reload
  ```

#### Frontend (Next.js)
- Install dependencies:
  ```powershell
  cd frontend
  npm install
  ```
- Start the frontend server:
  ```powershell
  npx next dev
  ```
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Upload and Analyze CV
- Upload your CV (PDF, DOCX, or TXT) via the web interface.
- The backend extracts structured data and benchmarks it against industry data.
- Choose a portfolio template and preview your generated site.

### 3. Customization and Deployment
- Template selection and customization are available in the UI.
- (Planned) Deploy your portfolio to Vercel or AWS with one click.

## 📦 Project Structure

- `backend/` — FastAPI app, AI integration, and business logic
- `frontend/` — Next.js app, React components, Tailwind CSS
- `ai-services/` — Model integration and pipelines
- `database/` — PostgreSQL and ChromaDB setup
- `templates/` — Portfolio templates
- `docs/` — Documentation
- `scripts/` — Utilities and automation

## 🧪 Testing
- Backend tests: `pytest` in the `backend/` directory
- Frontend: Manual and integration tests (add with your preferred framework)

## 🗺️ Roadmap Progress
- Core AI-powered CV parsing and RAG-based professional comparison: **100% complete**
- Dynamic website generation: **Basic UI, template selection, and preview complete**
- 3D/animated UI and advanced template customization: **In progress**
- User management, analytics, and deployment: **Planned**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/README.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DeepSeek AI for advanced reasoning capabilities
- Groq for fast inference
- OpenRouter for multi-model API access
- ChromaDB for vector search
- The open-source community for inspiration and tools
