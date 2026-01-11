from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey # <--- Added ForeignKey here
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    filename = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    summary = Column(Text)
    raw_text = Column(Text)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to answers
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id")) # Now this will work
    user_id = Column(String) 
    content = Column(Text)
    is_ai = Column(Integer, default=0) 
    votes = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question", back_populates="answers")


class Memory(Base):
    __tablename__ = "memories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    content = Column(Text)          # The user's note/insight
    tags = Column(String)           # AI-generated tags (comma-separated)
    timestamp = Column(DateTime, default=datetime.utcnow)