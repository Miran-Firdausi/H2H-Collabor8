import os
import re
import google.generativeai as genai


genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


def get_ai_response(message):
    llm_prompt = f"You are a chatbot for a project management website that would reply to user's query. Reply with HTML formatting starting from a div tag. The user message is {message}"
    response = model.generate_content(llm_prompt)
    if response.text:
        # Optionally, you can ensure only starting from <div> (if that's required)
        match = re.search(r"(<div.*?>.*</div>)", response.text, flags=re.DOTALL)
        if match:
            return match.group(1)  # Return the raw HTML starting from <div>

        return response.text

    return "I'm not sure how to respond to that."
