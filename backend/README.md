# UniSupport AI - University Helpdesk Backend

A modular FastAPI backend for an AI-powered university helpdesk system, designed for a 24-hour hackathon.

## Features

- **AI Integration**: Mocked `get_answer` service.
- **Advanced Logic**:
    - Intent detection (Attendance, Medical, Academic, Finance).
    - Emotion detection (Urgent, Frustrated, Neutral).
    - Dynamic priority assignment.
    - Confidence scoring logic.
    - Detailed decision explanations.
- **Automatic Ticket Storage**: Every query to `/ask` is automatically stored as a ticket in memory.
- **Fallback Handling**: Queries with no detected intent are flagged for manual review and escalated.
- **Modular Structure**: Clean separation of routes, models, and services.

## Project Structure

```text
university-helpdesk-backend/
├── main.py              # Application entry point
├── requirements.txt     # Python dependencies
├── models/              # Pydantic models
│   ├── ask.py
│   └── ticket.py
├── services/            # Business logic and mock services
│   ├── ai_service.py
│   ├── logic_service.py
│   ├── ticket_service.py
├── routes/              # API endpoints
│   ├── ask.py
│   └── tickets.py
```

## Setup and Running

### 1. Install Dependencies

Ensure you have Python 3.8+ installed.

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
uvicorn main:app --reload
```

The server will be available at `http://127.0.0.1:8000`.

### 3. API Documentation

Visit `http://127.0.0.1:8000/docs` to access the interactive OpenAPI documentation.

## Example API Usage

### Query the AI (`/ask`)

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/ask" -H "Content-Type: application/json" -d '{"query": "I missed class because I was sick"}'
```

**Response (Example):**
```json
{
  "answer": "Medical leaves require a certificate from a registered medical practitioner.",
  "sources": "Student Welfare Policy, Page 12",
  "intent": "medical",
  "emotion": "urgent",
  "priority": "high",
  "decision": "Escalate to Human Advisor for verification.",
  "confidence": 0.9,
  "explanation": "Detected 'medical' intent with 90% confidence. This case is marked as high priority due to its sensitive nature (e.g., medical or urgent emotion).",
  "status": "escalated"
}
```

### View Stored Tickets (`/tickets`)

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/tickets"
```

## Key Modules

- **models/**: Defines the data structure for API requests and responses.
- **services/logic_service.py**: Contains the intelligence for detecting intent and assigning priority.
- **services/ticket_service.py**: Handles in-memory storage of tickets.
- **routes/ask.py**: The primary endpoint that orchestrates AI results and business logic.
