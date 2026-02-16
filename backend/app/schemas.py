from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, Literal
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
    status: Literal["draft", "published"] = "draft"


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    status: Optional[Literal["draft", "published"]] = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: Dict[str, Any]
    status: Literal["draft", "published"]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True