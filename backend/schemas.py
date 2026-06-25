from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: str
    name: str
    github_username: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    github_username: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
