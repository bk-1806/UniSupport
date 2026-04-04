from typing import List, Optional
from models.ticket import Ticket
from datetime import datetime

# Shared in-memory store — persists for the lifetime of the server process
_tickets: List[Ticket] = []
_next_id: int = 1


def create_ticket(
    query: str,
    answer: Optional[str] = None,
    intent: Optional[str] = None,
    priority: str = "medium",
    status: str = "open",
) -> Ticket:
    """Create and store a new ticket. Returns the saved Ticket object."""
    global _next_id
    ticket = Ticket(
        id=_next_id,
        query=query,
        answer=answer,
        intent=intent,
        priority=priority,
        status=status,
        created_at=datetime.now(),
    )
    _tickets.append(ticket)
    _next_id += 1
    return ticket


def get_all_tickets() -> List[Ticket]:
    """Return all tickets stored in memory, ordered by creation time (oldest first)."""
    return list(_tickets)  # return a copy to prevent external mutation
