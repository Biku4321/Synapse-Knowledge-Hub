from app.core.database import engine, Base
from app.models.models import Document, ChatMessage

print("♻️  Resetting database...")

# 1. Drop all existing tables (Deletes old data)
Base.metadata.drop_all(bind=engine)
print("🗑️  Old tables dropped.")

# 2. Create new tables with updated columns
Base.metadata.create_all(bind=engine)
print("✅ New tables created successfully with 'user_id' column!")