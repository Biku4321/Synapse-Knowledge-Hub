from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_ai
import json

router = APIRouter()

class QuizRequest(BaseModel):
    text: str

@router.post("/generate")
async def generate_quiz(request: QuizRequest):
    # Strict prompt to force JSON format
    prompt = f"""
    Based on the following research summary, create a quiz with 5 Multiple Choice Questions.
    
    Summary: "{request.text[:3000]}"
    
    Return ONLY a raw JSON array. Do not use Markdown blocks.
    Format example:
    [
        {{
            "id": 1,
            "question": "What is the main finding?",
            "options": ["A", "B", "C", "D"],
            "answer": "A"
        }}
    ]
    """
    
    try:
        response_text = await gemini_ai.generate_response(prompt)
        
        # Clean up if AI adds ```json ... ``` wrappers
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        
        quiz_data = json.loads(clean_text)
        return quiz_data
        
    except Exception as e:
        print(f"Quiz Gen Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate quiz")