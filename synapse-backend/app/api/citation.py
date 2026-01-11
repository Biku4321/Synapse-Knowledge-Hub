from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_ai

router = APIRouter()

class CitationRequest(BaseModel):
    filename: str
    text_snippet: str # We pass the summary or first page text
    format: str # "APA", "MLA", "Chicago", "BibTeX"

@router.post("/generate")
async def generate_citation(request: CitationRequest):
    # Prompt engineering to force the AI to act like a librarian
    prompt = f"""
    Act as a strictly academic librarian. 
    Based on the following text snippet from a research paper, generate a correct {request.format} citation.
    
    Filename: "{request.filename}"
    Context Text: "{request.text_snippet[:3000]}"
    
    Rules:
    1. Extract the title, authors, and year if possible.
    2. If information is missing, use "n.d." or "Unknown" as per standard rules.
    3. Return ONLY the citation string. Do not add "Here is the citation".
    """
    
    try:
        citation = await gemini_ai.generate_response(prompt)
        # Clean up any potential markdown wrappers the AI might add
        clean_citation = citation.replace("```", "").strip()
        return {"citation": clean_citation}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not generate citation")