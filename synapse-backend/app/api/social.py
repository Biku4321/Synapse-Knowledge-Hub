from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Question, Answer
from app.services.gemini_service import gemini_ai
from pydantic import BaseModel
from typing import List

router = APIRouter()

class QuestionCreate(BaseModel):
    user_id: str
    title: str
    content: str

class AnswerCreate(BaseModel):
    user_id: str
    question_id: int
    content: str

# 1. Post a Question (Triggers Hybrid AI Layer)
@router.post("/questions")
async def create_question(q: QuestionCreate, db: Session = Depends(get_db)):
    # A. Save User Question
    new_q = Question(user_id=q.user_id, title=q.title, content=q.content)
    db.add(new_q)
    db.commit()
    db.refresh(new_q)

    # B. Trigger AI Answer (The Hybrid Layer)
    try:
        ai_prompt = f"Answer this academic question concisely: {q.title} - {q.content}"
        ai_response = await gemini_ai.generate_response(ai_prompt)
        
        ai_answer = Answer(
            question_id=new_q.id,
            user_id="Synapse AI",
            content=ai_response,
            is_ai=1,
            votes=10 # AI starts with some credibility
        )
        db.add(ai_answer)
        db.commit()
    except Exception as e:
        print(f"AI Answer Failed: {e}")

    return new_q

# 2. Get Feed
@router.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).order_by(Question.timestamp.desc()).limit(20).all()

# 3. Get Specific Question + Answers
@router.get("/questions/{q_id}")
def get_question_detail(q_id: int, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == q_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Get answers sorted by votes
    answers = db.query(Answer).filter(Answer.question_id == q_id).order_by(Answer.votes.desc()).all()
    return {"question": q, "answers": answers}

# 4. Post Human Answer
@router.post("/answers")
def create_answer(a: AnswerCreate, db: Session = Depends(get_db)):
    new_a = Answer(question_id=a.question_id, user_id=a.user_id, content=a.content)
    db.add(new_a)
    db.commit()
    return new_a

# 5. Vote
@router.post("/answers/{a_id}/vote")
def vote_answer(a_id: int, db: Session = Depends(get_db)):
    a = db.query(Answer).filter(Answer.id == a_id).first()
    if a:
        a.votes += 1
        db.commit()
    return {"votes": a.votes}

# 6. Debate Mode (Devil's Advocate)
@router.post("/debate")
async def debate_answer(text: str = Body(..., embed=True)):
    prompt = f"Act as a critical opponent. Provide a short, sharp counter-argument to this statement: '{text}'"
    response = await gemini_ai.generate_response(prompt)
    return {"counter_argument": response}