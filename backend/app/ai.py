import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_ai_response(prompt: str) -> str:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text.strip()


def summarize_notes(notes: str) -> str:
    prompt = f"""
You are an event lead management assistant.

Summarize the following event lead interaction notes in 2-4
professional and concise sentences.

Notes:
{notes}

Do not invent information that is not present in the notes.
"""

    return generate_ai_response(prompt)


def draft_follow_up(
    name: str,
    company: str,
    event: str,
    notes: str,
) -> str:
    prompt = f"""
You are a professional sales assistant.

Draft a short, polite follow-up message for an event lead.

Lead name: {name}
Company: {company}
Event: {event}
Interaction notes: {notes}

The message should:
- Be professional and friendly.
- Mention the previous interaction.
- Suggest a reasonable next step.
- Be concise.
- Do not invent information.
"""

    return generate_ai_response(prompt)


def generate_ai_text(*args, **kwargs) -> str:
    """
    Generate AI text while remaining compatible with the
    existing FastAPI AI endpoints.
    """

    # Get values whether they are passed positionally or by keyword.
    notes = kwargs.get("notes", "")
    name = kwargs.get("name", "")
    company = kwargs.get("company", "")
    event = kwargs.get("event", "")

    # If the existing endpoint passes a positional value,
    # use it as the notes/prompt only when notes wasn't supplied.
    if args and not notes:
        notes = args[0]

    prompt = f"""
You are an AI assistant for an event lead management system.

Lead name: {name}
Company: {company}
Event: {event}

Interaction notes:
{notes}

Summarize the interaction clearly and professionally in 2-4 concise sentences.

Do not invent information that is not present in the notes.
"""

    return generate_ai_response(prompt)