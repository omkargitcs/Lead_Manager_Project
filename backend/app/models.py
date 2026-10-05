from datetime import datetime
from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    company: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    event: Mapped[str] = mapped_column(String(180), nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)
    follow_up_status: Mapped[str] = mapped_column(String(40), default="Not Contacted", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
