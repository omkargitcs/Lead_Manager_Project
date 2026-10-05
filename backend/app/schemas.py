from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, EmailStr, Field

Status = Literal["Not Contacted", "Contacted", "Follow-up Sent", "Converted"]

class LeadBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    company: str = Field(min_length=1, max_length=160)
    email: EmailStr
    event: str = Field(min_length=1, max_length=180)
    notes: str = Field(default="", max_length=5000)
    follow_up_status: Status = "Not Contacted"

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    pass

class LeadOut(LeadBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime

class AIRequest(BaseModel):
    notes: str = Field(min_length=1, max_length=5000)
    name: str = Field(default="the lead", max_length=120)
    company: str = Field(default="their company", max_length=160)
    event: str = Field(default="the event", max_length=180)

class AIResponse(BaseModel):
    result: str
