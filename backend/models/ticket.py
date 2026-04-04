from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Ticket(BaseModel):
    """Represents a stored support ticket."""
    id: int
    query: str
    answer: Optional[str] = None
    intent: Optional[str] = None
    priority: Optional[str] = None
    status: str = "open"  # open | resolved | escalated
    created_at: datetime = Field(default_factory=datetime.now)  # avoids shared mutable default


class TicketCreate(BaseModel):
    """Payload for manually creating a ticket via POST /tickets."""
    query: str
    priority: Optional[str] = "medium"
