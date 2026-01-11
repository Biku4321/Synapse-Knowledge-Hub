from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from gtts import gTTS
from io import BytesIO

router = APIRouter()

class AudioRequest(BaseModel):
    text: str

@router.post("/generate")
async def generate_audio(request: AudioRequest):
    try:
        # Create a file-like object in memory
        mp3_fp = BytesIO()
        
        # Generate speech (English)
        # We limit text to 500 chars for the demo to keep it fast
        tts = gTTS(text=request.text[:1000], lang='en', slow=False)
        tts.write_to_fp(mp3_fp)
        
        # Reset pointer to the start of the file
        mp3_fp.seek(0)
        
        # Stream the audio back to the browser
        return StreamingResponse(mp3_fp, media_type="audio/mp3")

    except Exception as e:
        print(f"Audio Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate audio")