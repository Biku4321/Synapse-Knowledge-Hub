from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.services.gemini_service import gemini_ai  # Import the AI service
from app.api import pdf
from app.api import pdf, graph
from app.api import pdf, graph, lens
from app.api import pdf, graph, lens, audio
from app.api import pdf, graph, lens, audio, citation
from app.api import pdf, graph, lens, audio, citation, quiz
from app.api import pdf, graph, lens, audio, citation, quiz, chat
from app.api import pdf, graph, lens, audio, citation, quiz, chat, social
from app.api import pdf, graph, lens, audio, citation, quiz, chat, social, references # <--- Import references
from app.api import pdf, graph, lens, audio, citation, quiz, chat, social, references, timeline # <--- Import
from app.api import pdf, graph, lens, audio, citation, quiz, chat, social, references, timeline, memory # <--- Import

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Synapse Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Synapse Backend is working! 🚀"}

# --- NEW ROUTE TO TEST AI ---
@app.get("/api/test-ai")
async def test_ai_route(question: str = "Explain Quantum Computing in 1 sentence"):
    """
    Call this route like: http://localhost:8000/api/test-ai?question=What+is+DNA
    """
    answer = await gemini_ai.generate_response(question)
    return {"question": question, "ai_answer": answer}

app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(graph.router, prefix="/api/graph", tags=["Graph"])
app.include_router(lens.router, prefix="/api/lens", tags=["Lens"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])
app.include_router(citation.router, prefix="/api/citation", tags=["Citation"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(social.router, prefix="/api/social", tags=["Social"])
app.include_router(references.router, prefix="/api/references", tags=["References"]) # <--- Register
app.include_router(timeline.router, prefix="/api/timeline", tags=["Timeline"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory"]) # <--- Register