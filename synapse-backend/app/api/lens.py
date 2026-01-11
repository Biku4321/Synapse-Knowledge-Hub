from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_ai

router = APIRouter()

class ExplainRequest(BaseModel):
    text: str
    context: str = ""

@router.post("/explain")
async def explain_term(request: ExplainRequest):
    prompt = f"""
    Explain the term "{request.text}" simply (like I am 5 years old).
    Context: "{request.context[:200]}"
    Keep the answer extremely concise (max 2 sentences).
    """
    
    try:
        explanation = await gemini_ai.generate_response(prompt)
        
        # Check if Google returned an error inside the text response
        if "quota" in explanation.lower() or "429" in explanation:
            return {"term": request.text, "explanation": "⚠️ AI Daily Limit Reached. Please wait a moment."}
            
        return {"term": request.text, "explanation": explanation}
        
    except Exception as e:
        print(f"Lens Error: {e}")
        # Return a polite error instead of crashing
        return {"term": request.text, "explanation": "⚠️ System is busy. Try again later."}