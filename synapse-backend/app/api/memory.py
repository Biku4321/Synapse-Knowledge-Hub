from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Memory
from app.services.gemini_service import gemini_ai

router = APIRouter()

class MemoryCreate(BaseModel):
    user_id: str
    content: str

@router.post("/add")
async def add_memory(mem: MemoryCreate, db: Session = Depends(get_db)):
    # 1. Ask AI to generate tags for organization
    prompt = f"""
    Analyze this short user note and generate 3 relevant topic tags (one word each).
    Note: "{mem.content}"
    Return ONLY comma-separated tags. Example: "DeepLearning, Optimization, History"
    """
    tags = await gemini_ai.generate_response(prompt)
    
    # 2. Save to DB
    new_mem = Memory(
        user_id=mem.user_id,
        content=mem.content,
        tags=tags.replace("\n", "").strip()
    )
    db.add(new_mem)
    db.commit()
    return new_mem

@router.get("/list")
def get_memories(user_id: str, db: Session = Depends(get_db)):
    return db.query(Memory).filter(Memory.user_id == user_id).order_by(Memory.timestamp.desc()).all()