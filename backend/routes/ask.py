from fastapi import APIRouter, HTTPException
from models.ask import AskRequest, AskResponse
from services.ai_service import get_answer
from services.logic_service import process_query_logic
from services.ticket_service import create_ticket

router = APIRouter()

MAX_QUERY_LENGTH = 500  # Reasonable upper bound to prevent abuse


@router.post("/ask", response_model=AskResponse, summary="Submit a student query")
async def ask_question(request: AskRequest):
    """
    Process a student query through the AI engine and business logic pipeline.
    The query is automatically saved as a support ticket for audit purposes.
    """
    query = request.query.strip()

    # Edge case: empty or whitespace-only query
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # Edge case: unusually long input
    if len(query) > MAX_QUERY_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Query is too long. Please keep it under {MAX_QUERY_LENGTH} characters.",
        )

    # Step 1 — Fetch AI-generated answer and source references
    ai_result = get_answer(query)

    # Step 2 — Enrich with intent, priority, decision, action, and explanation
    logic = process_query_logic(query)

    # Step 3 — Persist as ticket for later review via GET /tickets
    create_ticket(
        query=query,
        answer=ai_result["answer"],
        intent=logic["intent"],
        priority=logic["priority"],
        status=logic["status"],
    )

    return AskResponse(
        answer=ai_result["answer"],
        sources=ai_result["sources"],
        intent=logic["intent"],
        emotion=logic["emotion"],
        priority=logic["priority"],
        decision=logic["decision"],
        action=logic["action"],
        confidence=logic["confidence"],
        explanation=logic["explanation"],
        status=logic["status"],
    )
