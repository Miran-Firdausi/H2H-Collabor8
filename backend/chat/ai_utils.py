import os
import google.generativeai as genai


genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def get_ai_response(prompt):
    response = genai.generate(model="gemini-pro", prompt=prompt)
    return (
        response.generations[0].text
        if response.generations
        else "I'm not sure how to respond to that."
    )
