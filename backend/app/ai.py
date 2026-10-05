import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview").strip()

# Import the SDK only when it is actually needed. This allows the
# FastAPI application to start even when no Gemini API key is configured.
client = None


def _get_client():
    global client

    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. Add it to Render environment variables "
            "to enable AI features."
        )

    if client is None:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)

    return client


def generate_ai_response(prompt: str) -> str:
    response = _get_client().models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    text = getattr(response, "text", None)
    if not text:
        raise RuntimeError("Gemini returned an empty response.")

    return text.strip()


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
    """Generate AI text while remaining compatible with existing endpoints."""
    notes = kwargs.get("notes", "")
    name = kwargs.get("name", "")
    company = kwargs.get("company", "")
    event = kwargs.get("event", "")

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
