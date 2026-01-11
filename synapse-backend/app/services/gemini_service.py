import google.generativeai as genai
import os
from dotenv import load_dotenv

# 1. Load environment variables
load_dotenv()

class GeminiService:
    def __init__(self):
        # Get the API Key from .env
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            print("⚠️ WARNING: GEMINI_API_KEY not found in .env file.")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Use 'gemini-1.5-flash' (It is fast and free-tier friendly)
        self.model = genai.GenerativeModel('gemini-2.5-flash-lite')

    async def generate_response(self, prompt: str):
        """
        Sends a text prompt to Gemini and returns the text response.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Error: {str(e)}"

# Create a single instance to import elsewhere
gemini_ai = GeminiService()