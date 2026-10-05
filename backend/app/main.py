import os
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from .ai import generate_ai_text
from .database import Base, engine, get_db
from .models import Lead
from .schemas import AIRequest, AIResponse, LeadCreate, LeadOut, LeadUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Even8 AI Event Lead Manager", version="1.0.0")

origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Even8 AI Event Lead Manager API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/leads", response_model=list[LeadOut])
def list_leads(
    search: str | None = Query(default=None),
    status: str | None = Query(default=None),
    event: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(Lead).order_by(Lead.updated_at.desc())
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(or_(Lead.name.ilike(pattern), Lead.company.ilike(pattern), Lead.email.ilike(pattern), Lead.event.ilike(pattern), Lead.notes.ilike(pattern)))
    if status and status != "All":
        stmt = stmt.where(Lead.follow_up_status == status)
    if event and event != "All":
        stmt = stmt.where(Lead.event == event)
    return db.scalars(stmt).all()

@app.get("/api/leads/{lead_id}", response_model=LeadOut)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    return lead

@app.post("/api/leads", response_model=LeadOut, status_code=201)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@app.put("/api/leads/{lead_id}", response_model=LeadOut)
def update_lead(lead_id: int, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    for key, value in payload.model_dump().items():
        setattr(lead, key, value)
    db.commit()
    db.refresh(lead)
    return lead

@app.delete("/api/leads/{lead_id}", status_code=204)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    db.delete(lead)
    db.commit()

@app.post("/api/ai/summary", response_model=AIResponse)
def ai_summary(payload: AIRequest):
    try:
        return AIResponse(result=generate_ai_text("summary", **payload.model_dump()))
    except RuntimeError as exc:
        raise HTTPException(503, str(exc))
    except Exception as exc:
        raise HTTPException(502, f"AI request failed: {exc}")

@app.post("/api/ai/follow-up", response_model=AIResponse)
def ai_follow_up(payload: AIRequest):
    try:
        return AIResponse(result=generate_ai_text("follow-up", **payload.model_dump()))
    except RuntimeError as exc:
        raise HTTPException(503, str(exc))
    except Exception as exc:
        raise HTTPException(502, f"AI request failed: {exc}")
