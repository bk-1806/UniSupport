from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ask import router as ask_router
from routes.tickets import router as tickets_router
import os

app = FastAPI(
    title="UniSupport AI — University Helpdesk",
    description=(
        "AI-powered backend for the UniSupport university helpdesk system. "
        "Processes student queries, detects intent and emotion, assigns priority, "
        "and returns structured policy-grounded decisions."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_router, tags=["Support"])
app.include_router(tickets_router, tags=["Tickets"])


@app.get("/", tags=["Health"], summary="Health check")
async def health_check():
    """Confirm the server is running and return the docs URL."""
    return {
        "status": "ok",
        "message": "UniSupport AI backend is running.",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
