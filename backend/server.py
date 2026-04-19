"""Minimal FastAPI backend for Vitória app.

Supabase is the primary datastore / auth. This backend exists to:
  - Host AI helpers (description / badge / testimonial reply) that use the Emergent LLM key,
    keeping the key off the client.
  - Provide a /api/health endpoint for supervisor.
"""
from __future__ import annotations

import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

app = FastAPI(title="Vitória Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "vitoria-backend"}


# ------------------------------------------------------------
# AI helpers (Emergent LLM key)
# ------------------------------------------------------------
class DescribeIn(BaseModel):
    name: str
    category: Optional[str] = None
    hint: Optional[str] = None


class BadgeIn(BaseModel):
    name: str
    description: Optional[str] = None
    sales: Optional[int] = None


class ReplyIn(BaseModel):
    author: str
    rating: int
    content: Optional[str] = None


async def _chat(system: str, user: str) -> str:
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "EMERGENT_LLM_KEY not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage  # type: ignore
    except Exception as exc:  # pragma: no cover
        raise HTTPException(500, f"emergentintegrations indisponível: {exc}") from exc

    import uuid

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"vitoria-{uuid.uuid4()}",
        system_message=system,
    ).with_model("openai", "gpt-4o-mini")
    resp = await chat.send_message(UserMessage(text=user))
    return str(resp).strip()


@app.post("/api/ai/describe")
async def ai_describe(body: DescribeIn):
    system = (
        "Você é um copywriter especialista em gastronomia brasileira. "
        "Escreva descrições curtas (máx 180 caracteres), apetitosas, em português, sem emojis."
    )
    prompt = f"Produto: {body.name}"
    if body.category:
        prompt += f"\nCategoria: {body.category}"
    if body.hint:
        prompt += f"\nDica: {body.hint}"
    prompt += "\nGere APENAS a descrição, sem aspas."
    text = await _chat(system, prompt)
    return {"description": text[:240]}


@app.post("/api/ai/badge")
async def ai_badge(body: BadgeIn):
    system = (
        "Você sugere badges curtas (máx 18 caracteres) para produtos em um cardápio digital, "
        "em português. Exemplos: 'Mais Vendido', 'Destaque', 'Novo', 'Picante', 'Fit'. "
        "Responda APENAS a badge, sem aspas, sem pontuação final."
    )
    prompt = f"Produto: {body.name}"
    if body.description:
        prompt += f"\nDescrição: {body.description}"
    if body.sales is not None:
        prompt += f"\nVendas últimos 30 dias: {body.sales}"
    text = await _chat(system, prompt)
    return {"badge": text.strip('"').strip("'")[:24]}


@app.post("/api/ai/reply-testimonial")
async def ai_reply(body: ReplyIn):
    system = (
        "Você é atendente do Restaurante Vitória. Responda depoimentos com carinho, "
        "em português, curto (máx 220 caracteres), sem emojis, agradecendo e convidando a voltar."
    )
    prompt = f"Cliente: {body.author}\nEstrelas: {body.rating}/5"
    if body.content:
        prompt += f"\nComentário: {body.content}"
    text = await _chat(system, prompt)
    return {"reply": text[:280]}
