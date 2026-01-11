from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Document
from app.services.gemini_service import gemini_ai
import json

router = APIRouter()

class RefRequest(BaseModel):
    doc_id: int

@router.post("/extract")
async def extract_references(request: RefRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == request.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # We ask Gemini to find the bibliography and map numbers to text
    prompt = f"""
    Analyze this research paper text. Locate the "References" or "Bibliography" section.
    Extract the references and map them to their citation numbers (e.g., [1], [2]).
    
    Text (last 20000 characters): "{doc.raw_text[-20000:]}" 
    
    Return ONLY a raw JSON object where keys are the numbers and values are the citation text.
    Example:
    {{
        "1": "Smith, J. (2020). AI Trends.",
        "2": "Doe, A. (2021). Future of Code."
    }}
    If no numbered references are found, return {{}}.
    """
    
    try:
        response = await gemini_ai.generate_response(prompt)
        # Clean markdown wrappers
        clean_json = response.replace("```json", "").replace("```", "").strip()
        ref_map = json.loads(clean_json)
        return ref_map
    except Exception as e:
        print(f"Ref Error: {e}")
        return {}