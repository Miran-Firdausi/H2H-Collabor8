import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_ai_response(prompt):
    response = genai.generate(
        model="gemini-pro",
        prompt=prompt
    )
    return response.generations[0].text if response.generations else "I'm not sure how to respond to that."
