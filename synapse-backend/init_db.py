from app.core.database import engine, Base
from app.models.models import Document, ChatMessage

print("Creating tables in database...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")