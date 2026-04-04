from pydantic import BaseModel
from typing import List


class AskRequest(BaseModel):
    """Incoming request to the /ask endpoint."""
    query: str


class AskResponse(BaseModel):
    """
    Full structured response returned by the /ask endpoint.
    Every field is always present — no nulls, no missing keys.
    """
    answer: str          # AI-generated answer to the student's query
    sources: List[str]   # Policy documents or references used
    intent: str          # Detected topic (medical, attendance, academic, finance, or 'Needs manual review')
    emotion: str         # Detected emotional tone (urgent, concerned, frustrated, neutral)
    priority: str        # Case priority: low | medium | high
    decision: str        # Eligibility outcome based on university policy
    action: str          # Concrete next step recommended for the student
    confidence: str      # Confidence score as a readable percentage e.g. "90%"
    explanation: str     # Policy-grounded explanation of the decision
    status: str          # Final resolution: "resolved" or "escalated"
