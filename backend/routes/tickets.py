from fastapi import APIRouter, HTTPException
from typing import List
from models.ticket import Ticket, TicketCreate
from services.ticket_service import create_ticket, get_all_tickets

router = APIRouter()


@router.get("/tickets", response_model=List[Ticket], summary="List all support tickets")
async def list_tickets():
    """Return all support tickets stored in memory, oldest first."""
    return get_all_tickets()


@router.post("/tickets", response_model=Ticket, summary="Create a support ticket manually")
async def add_ticket(payload: TicketCreate):
    """
    Manually create a support ticket.
    Most tickets are created automatically via POST /ask,
    but this endpoint allows direct submission if needed.
    """
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Ticket query cannot be empty.")

    return create_ticket(
        query=query,
        priority=payload.priority,
        status="open",
    )
