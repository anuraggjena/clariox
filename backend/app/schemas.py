from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime


# -------- AUTH --------

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -------- POSTS --------

class PostBase(BaseModel):
    title: Optional[str] = "Untitled"
    content: Dict[str, Any]


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str]
    content: Optional[Dict[str, Any]]
    status: Optional[str]


class PostResponse(BaseModel):
    id: int
    title: str
    content: Dict[str, Any]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
