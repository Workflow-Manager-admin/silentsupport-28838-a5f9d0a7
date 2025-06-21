from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional
from uuid import uuid4
from enum import Enum
import datetime

app = FastAPI(
    title="SilentSupport Ticketing API",
    description=(
        "Anonymous ticket submission, status tracking, updates, "
        "and notifications for SilentSupport."
    ),
    version="1.0.0",
    openapi_tags=[
        {
            "name": "tickets",
            "description": "Operations for creating, retrieving, and updating tickets"
        },
        {
            "name": "notifications",
            "description": "Simple notifications related to ticket events"
        },
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory ticket storage ---
tickets: Dict[str, Dict] = {}
notifications: Dict[str, list] = {}


# --- Ticket Status Enum ---

class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


# --- Pydantic Models ---

class TicketCreateRequest(BaseModel):
    """Model for submitting a new anonymous ticket."""
    title: str = Field(..., description="Short summary of the issue or request")
    description: str = Field(..., description="Detailed information about the ticket")


class TicketResponse(BaseModel):
    """Response model for returned ticket info."""
    id: str = Field(..., description="Ticket ID for tracking")
    title: str
    description: str
    status: TicketStatus = Field(..., description="Current status of the ticket")
    created_at: datetime.datetime
    updated_at: datetime.datetime


class TicketUpdateRequest(BaseModel):
    """Model for updating an existing ticket."""
    title: Optional[str] = Field(None, description="Update summary/title")
    description: Optional[str] = Field(None, description="Update description details")
    status: Optional[TicketStatus] = Field(None, description="Update status")


class Notification(BaseModel):
    """Model for ticket event notification."""
    ticket_id: str
    message: str
    timestamp: datetime.datetime


# --- TICKET ROUTES ---

# PUBLIC_INTERFACE
@app.post(
    "/tickets",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["tickets"],
    summary="Create new anonymous ticket",
    description="Allows any user to submit a new ticket without authentication.",
)
def submit_ticket(request: TicketCreateRequest):
    """Create a new anonymous ticket. Returns the ticket ID for tracking and status lookup."""
    ticket_id = str(uuid4())
    now = datetime.datetime.utcnow()
    ticket = {
        "id": ticket_id,
        "title": request.title,
        "description": request.description,
        "status": TicketStatus.OPEN,
        "created_at": now,
        "updated_at": now,
    }
    tickets[ticket_id] = ticket
    # Add new ticket notification
    notifications.setdefault(ticket_id, []).append(
        Notification(
            ticket_id=ticket_id,
            message="Ticket created.",
            timestamp=now,
        )
    )
    return TicketResponse(**ticket)


# PUBLIC_INTERFACE
@app.get(
    "/tickets/{ticket_id}",
    response_model=TicketResponse,
    tags=["tickets"],
    summary="Get ticket status and details",
    description="Fetches current status and details for a ticket by ID (no authentication required).",
)
def get_ticket(ticket_id: str):
    """Get current status/details for a ticket using its ID."""
    if ticket_id not in tickets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    return TicketResponse(**tickets[ticket_id])


# PUBLIC_INTERFACE
@app.put(
    "/tickets/{ticket_id}",
    response_model=TicketResponse,
    tags=[
        "tickets"
    ],
    summary="Update a ticket",
    description="Update a ticket's status or details using its ID.",
)
def update_ticket(ticket_id: str, request: TicketUpdateRequest):
    """Update the details or status of an existing ticket by ID."""
    if ticket_id not in tickets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    ticket = tickets[ticket_id]
    have_changes = False
    now = datetime.datetime.utcnow()
    if request.title is not None:
        ticket["title"] = request.title
        have_changes = True
    if request.description is not None:
        ticket["description"] = request.description
        have_changes = True
    if request.status is not None:
        ticket["status"] = request.status
        have_changes = True
        # Add a status-change notification
        notifications.setdefault(ticket_id, []).append(
            Notification(
                ticket_id=ticket_id,
                message=f"Status changed to {request.status}.",
                timestamp=now,
            )
        )
    if have_changes:
        ticket["updated_at"] = now
    tickets[ticket_id] = ticket
    return TicketResponse(**ticket)


# PUBLIC_INTERFACE
@app.get(
    "/tickets/{ticket_id}/notifications",
    response_model=list[Notification],
    tags=["notifications"],
    summary="Get notifications for a ticket",
    description=(
        "Returns a simple list of notifications (such as status changes) "
        "for the specified ticket ID."
    ),
)
def get_ticket_notifications(ticket_id: str):
    """Get a list of simple notifications for a ticket by ID."""
    if ticket_id not in tickets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    return notifications.get(ticket_id, [])


# --- Health Check ---

@app.get("/", include_in_schema=False)
def health_check():
    """Simple health check endpoint."""
    return {"message": "Healthy"}
