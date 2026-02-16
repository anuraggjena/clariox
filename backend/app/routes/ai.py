from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal
from ..core.dependencies import get_current_user
from ..services.groq_service import generate_text

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Request Schema
class AIRequest(BaseModel):
    text: str
    type: Literal["summary", "grammar", "improve", "conversational"]

# AI Generate Endpoint
@router.post("/generate")
async def generate_ai(
    request: AIRequest,
    current_user = Depends(get_current_user)
):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = await generate_text(request.text, request.type)
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI generation failed")

    return {
        "mode": request.type,
        "result": result
    }
