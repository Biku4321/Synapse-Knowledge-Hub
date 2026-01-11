from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_ai
import json

router = APIRouter()

class GraphRequest(BaseModel):
    summary: str

@router.post("/generate")
async def generate_graph(request: GraphRequest):
    # We ask Gemini to give us strictly formatted JSON
    prompt = f"""
    Based on this research summary, create a Knowledge Graph JSON.
    Identify 5-7 core concepts (nodes) and how they relate (links).
    
    Summary: "{request.summary[:1000]}"
    
    Return ONLY raw JSON in this exact format (no markdown code blocks):
    {{
        "nodes": [
            {{"id": "Main Topic", "group": 1}},
            {{"id": "Sub Concept A", "group": 2}}
        ],
        "links": [
            {{"source": "Main Topic", "target": "Sub Concept A"}}
        ]
    }}
    """
    
    try:
        # Get response
        raw_response = await gemini_ai.generate_response(prompt)
        
        # Clean the response (sometimes AI adds ```json ... ``` wrapper)
        cleaned_response = raw_response.replace("```json", "").replace("```", "").strip()
        
        graph_data = json.loads(cleaned_response)
        return graph_data
        
    except Exception as e:
        print(f"Graph Error: {e}")
        # Fallback data if AI fails
        return {
            "nodes": [{"id": "Error", "group": 1}],
            "links": []
        }