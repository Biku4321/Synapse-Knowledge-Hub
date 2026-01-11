from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.gemini_service import gemini_ai
from app.core.database import get_db
from app.models.models import Document

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    doc_id: int | None = None
    mode: str = "Standard"
    audience: str = "Undergrad"
@router.post("/ask")
async def ask_question(request: ChatRequest, db: Session = Depends(get_db)):
    context_text = ""
    
    # 1. If a specific document is selected, fetch its text
    if request.doc_id:
        doc = db.query(Document).filter(Document.id == request.doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # We limit text to ~50,000 characters to be safe with speed/limits
        # (Average paper is 20k-40k chars)
        context_text = doc.raw_text[:50000] 
        
    audience_prompts = {
        "Child": "Explain simply using analogies, as if to a 5-year-old.",
        "High School": "Explain clearly avoiding heavy jargon, suitable for a high school student.",
        "Undergrad": "Use standard academic tone suitable for a college student.",
        "Expert": "Use highly technical, dense, and precise language suitable for a PhD researcher."
        }
    
    mode_prompts = {
        "Standard": "You are a helpful assistant.",
        "Critic": "You are a skeptical peer reviewer. Aggressively challenge assumptions and look for weaknesses.",
        "Viva": "You are a Viva examiner. Ask 3 tough follow-up questions to test the student's depth.",
        "Flaws": "Focus ONLY on methodology flaws, bias, and missing data."
    }
        
    sys_instruction = f"""
    {mode_prompts.get(request.mode, "You are a helpful assistant.")}
    {audience_prompts.get(request.audience, "Use standard academic tone.")}
    
    Answer based on the context below.
    --- CONTEXT ---
    {context_text}
    """

    # 2. Send to Gemini
    try:
        prompt = f"{system_instruction}\n\nUser Question: {request.question}"
        answer = await gemini_ai.generate_response(prompt)
        return {"answer": answer}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"answer": "Sorry, I encountered an error processing your request."}