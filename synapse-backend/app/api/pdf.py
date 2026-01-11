from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from pypdf import PdfReader
from io import BytesIO
from app.services.gemini_service import gemini_ai
from app.core.database import get_db
from app.models.models import Document
from pydantic import BaseModel
router = APIRouter()

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...), 
    user_id: str = Form(...), # <--- Receive User ID from Frontend Form
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # 1. Read PDF
        contents = await file.read()
        pdf_file = BytesIO(contents)
        reader = PdfReader(pdf_file)
        
        text = ""
        for page in reader.pages[:10]: 
            text += page.extract_text() + "\n"

        if not text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text.")

        # 2. AI Summary
        prompt = f"Analyze this research paper. Provide a summary and 3 key takeaways. Text: {text[:4000]}"
        summary = await gemini_ai.generate_response(prompt)

        # 3. SAVE TO DATABASE
        new_doc = Document(
            user_id=user_id, # Save the user_id
            filename=file.filename,
            summary=summary,
            raw_text=text 
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        return {
            "id": new_doc.id,
            "filename": new_doc.filename,
            "summary": new_doc.summary
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process PDF")

# --- FIX IS HERE ---
@router.get("/list")
def get_documents(user_id: str, db: Session = Depends(get_db)): # <--- Added user_id: str here
    # Now 'user_id' is defined and can be used in the filter below
    return db.query(Document).filter(Document.user_id == user_id).order_by(Document.upload_date.desc()).all()

class CompareRequest(BaseModel):
    doc1_id: int
    doc2_id: int

@router.post("/compare")
async def compare_docs(req: CompareRequest, db: Session = Depends(get_db)):
    d1 = db.query(Document).filter(Document.id == req.doc1_id).first()
    d2 = db.query(Document).filter(Document.id == req.doc2_id).first()
    
    if not d1 or not d2: raise HTTPException(404, detail="Docs not found")

    prompt = f"""
    Compare these two research papers side-by-side.
    Create a Markdown table comparing them on: Methodology, Dataset, Core Findings, and Weaknesses.
    
    Paper 1: {d1.filename}
    Summary 1: {d1.summary}
    
    Paper 2: {d2.filename}
    Summary 2: {d2.summary}
    """
    
    response = await gemini_ai.generate_response(prompt)
    return {"comparison": response}