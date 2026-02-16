import httpx
from ..core.config import GROQ_API_KEY

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def build_system_prompt(mode: str) -> str:
    if mode == "summary":
        return (
            "You are an expert writing assistant. "
            "Provide a clear, concise, well-structured summary of the given content. "
            "Do not add commentary. "
            "Do not explain that it is a summary. "
            "Return only the summarized text."
        )

    if mode == "grammar":
        return (
            "You are a professional grammar correction engine. "
            "Rewrite the text with corrected grammar and clarity. "
            "Do not explain the changes. "
            "Do not provide alternatives. "
            "Do not add commentary. "
            "Return only the corrected text."
        )

    if mode == "improve":
        return (
            "You are a professional content strategist. "
            "Enhance the writing to make it more engaging, structured, and impactful. "
            "Preserve the author's core message."
            "Do not use markdown formatting symbols such as **, *, or #. "
            "Do not explain changes. "
            "Return only the improved version."
        )

    if mode == "conversational":
        return (
            "You are a friendly and intelligent assistant. "
            "Rewrite the content in a more natural, conversational tone "
            "while keeping it professional and clear."
        )

    return "You are an intelligent writing assistant."


async def generate_text(prompt: str, mode: str = "summary"):
    system_prompt = build_system_prompt(mode)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.6
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=payload)

    response.raise_for_status()

    data = response.json()
    return data["choices"][0]["message"]["content"]
