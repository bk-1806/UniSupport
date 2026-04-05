# UniSupport AI
### AI Customer Support Automation Agent [AI05]

> An autonomous AI agent that handles university support queries using a structured knowledge base — with escalation, context tracking, and decision explanations.

---

## Problem Statement [AI05]

> *"Customer support teams struggle to respond to large volumes of queries while maintaining context. Build an AI agent that autonomously handles support queries using company knowledge bases."*

**UniSupport AI** directly addresses this by building a fully autonomous support agent for a university environment — resolving student tickets instantly using official policy documents, escalating complex cases to human staff, and providing full decision transparency.

---

## Feature Requirements Fulfilled

| Requirement | Implementation |
|-------------|---------------|
| User submits support tickets | Ticket dashboard with unique `TKT-[timestamp]` ID per submission |
| Retrieve relevant documentation | Custom RAG pipeline loads deduplicated university policy context |
| Understand the issue | Groq LLM (LLaMA 3.1 8B) analyzes query intent from natural language |
| Generate responses | AI resolution displayed with full explanation in the response panel |
| Escalate complex issues | Tickets auto-flagged as `Escalated to Admin` or `Needs Review` with amber UI alert |
| Track conversation context | Session-based ticket history sidebar (last 3 tickets) |
| Suggest knowledge base updates | System designed for continuous ingestion — add new `.txt` files and re-run `preprocess.py` |
| Ticket dashboard | Full-featured Next.js dashboard with recent tickets, status badges, confidence score |
| AI-generated responses | LLM generates natural-language resolution for every ticket |
| Agent decision explanations | Expandable "Detailed Explanation" section on every ticket card |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   STUDENT / USER                        │
│             Submits Support Ticket via UI               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend  (Port 3000)              │
│  Landing Page → Dashboard → Ticket Panel → History      │
└────────────────────────┬────────────────────────────────┘
                         │ POST /ask
                         ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend  (Port 8080)                │
│                                                         │
│  1. Load processed_knowledge.txt (global cache)         │
│  2. Inject context into Groq LLM prompt                 │
│  3. Receive decision + confidence + explanation         │
│  4. Return structured JSON response                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Groq AI — LLaMA 3.1 8B Instant             │
│                                                         │
│  System Prompt:                                         │
│  "Use ONLY the provided context.                        │
│   If answer not found, return 'Needs Review'."          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           Knowledge Base (RAG Pipeline)                  │
│                                                         │
│  raw_data/ ──► preprocess.py ──► processed_knowledge.txt│
│  (PDF text)    (deduplication)   (4000 char context)    │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS, Turbopack |
| Backend | FastAPI (Python), Uvicorn |
| AI Agent | Groq Cloud — `llama-3.1-8b-instant` |
| RAG Pipeline | Custom Python deduplication (no FAISS / no embeddings) |
| Prompt Engine | LangChain Core (`ChatPromptTemplate`) |

---

## Agent Decision Flow

```
Student Query Received
        │
        ▼
  Context Injected (University Policies + CRT Rules)
        │
        ▼
  LLM Analyzes Intent
        │
        ├──► "approve" / "eligible"   →  RESOLVED
        ├──► "escalate"               →  ESCALATED TO ADMIN
        ├──► "reject" / "block"       →  CLOSED
        └──► "review" / default       →  NEEDS REVIEW
```

For `Escalated to Admin` and `Needs Review`, the UI shows:
- Amber warning badge
- Alert: *"This issue requires manual review"*
- Expandable explanation of why the AI could not resolve it

---

## Project Structure

```
UniSupport/
├── backend/
│   ├── main.py                      # FastAPI app entry point
│   ├── .env                         # GROQ_API_KEY
│   ├── rag/
│   │   ├── raw_data/                # Drop PDF text files here
│   │   │   ├── gitam_rules.txt      # University academic regulations
│   │   │   └── crt_rules.txt        # CRT support system guidelines
│   │   ├── preprocess.py            # Deduplication + chunking engine
│   │   └── processed_knowledge.txt  # Optimized context (auto-generated)
│   └── services/rag/
│       └── query.py                 # Groq LLM inference + prompt
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   └── dashboard/page.tsx       # Ticket dashboard
│   └── components/
│       ├── header.tsx               # System status header
│       ├── query-panel.tsx          # Ticket input form
│       ├── response-panel.tsx       # AI resolution + status card
│       └── insights-panel.tsx       # Intent, emotion, priority
├── start.bat                        # One-click launcher
└── README.md
```

---

## Setup

### 1. Environment
Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Backend
```bash
cd backend
pip install fastapi uvicorn langchain-groq langchain-core python-dotenv
```

### 3. Frontend
```bash
cd frontend
npm install
```

### 4. Add Knowledge Documents
```bash
# Copy PDF text into raw_data/ then run:
cd backend/rag
python preprocess.py
```

### 5. Launch
```bash
start.bat
# Then open: http://localhost:3000
```

---

## Knowledge Base Pipeline

1. Paste exported PDF text into `backend/rag/raw_data/`
2. `preprocess.py` splits into 300–500 char chunks, normalizes, and hash-deduplicates
3. Clean output saved to `processed_knowledge.txt`
4. Backend loads this **once at startup** (global variable — zero re-reading per request)

---

## API

### `POST /ask`
```json
// Request
{ "query": "I was sick and missed 3 days of class. What do I do?" }

// Response
{
  "answer": "According to Section 11.2, you must submit a medical certificate...",
  "decision": "Needs Review",
  "confidence": 82,
  "sources": ["processed_knowledge.txt"]
}
```

---

## Performance

| Metric | Value |
|--------|-------|
| Server startup | ~1 second |
| Ticket resolution time | 2–4 seconds |
| Memory footprint | ~50MB |
| Frontend navigation | < 200ms (Turbopack + prefetch) |

link :- https://uni-support-git-ai-rag-abhinaymentes-projects.vercel.app/
---

*UniSupport AI — Problem Statement AI05 — GITAM University*
