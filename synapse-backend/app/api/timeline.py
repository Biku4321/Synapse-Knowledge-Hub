from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Document
from app.services.gemini_service import gemini_ai
import json

router = APIRouter()

@router.get("/generate")
async def generate_timeline(user_id: str, db: Session = Depends(get_db)):
    # 1. Fetch all user docs
    docs = db.query(Document).filter(Document.user_id == user_id).all()
    
    if len(docs) < 2:
        return [] # Need at least 2 papers to make a timeline

    # 2. Prepare data for Gemini
    docs_text = "\n".join([f"ID: {d.id} | Title: {d.filename} | Summary: {d.summary}" for d in docs])

    # 3. Ask AI to find the "Story"
    prompt = f"""
    Analyze these research papers and construct a chronological "Timeline of Ideas".
    Identify how concepts evolved from one paper to the next.
    
    Papers:
    {docs_text}
    
    Return a JSON array ONLY. Format:
    [
        {{
            "year": "2018 (Derived from text)",
            "title": "The Transformer Shift",
            "description": "Paper 'Attention is All You Need' introduced self-attention, moving away from RNNs.",
            "doc_id": 12
        }}
    ]
    Sort by logical progression or date.
    """
    
    try:
        response = await gemini_ai.generate_response(prompt)
        clean_json = response.replace("```json", "").replace("```", "").strip()
        timeline_data = json.loads(clean_json)
        return timeline_data
    except Exception as e:
        print(f"Timeline Error: {e}")
        return []