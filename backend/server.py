"""FastAPI backend for Vitória — Emergent Auth + Supabase gatekeeper.

REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

Responsibilities:
  • Emergent Managed Google Auth session exchange + cookie issuance
  • Proxy-protected writes to Supabase (uses SERVICE ROLE — bypasses RLS)
  • Admin allowlist enforcement (hardcoded emails + profile role)
  • AI helpers (describe / badge / testimonial reply) via Emergent LLM key
  • Email sending (order confirmation / status update / testimonial reply)
"""
from __future__ import annotations

import os
import uuid
import json
import smtplib
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Cookie, Depends, FastAPI, HTTPException, Request, Response, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

load_dotenv()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

# Admin allowlist (hardcoded — always admin regardless of DB role)
ADMIN_EMAILS = {
    "gustavomonteiro09g@gmail.com",
    "gustavomonte10g@gmail.com",
}

# Email (optional — SMTP). If unset, emails are logged only.
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_FROM = os.environ.get("SMTP_FROM", "Vitória <no-reply@vitoria.app>")

EMAIL_DIR = Path(__file__).parent.parent / "emails"

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

app = FastAPI(title="Vitória Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if CORS_ORIGINS == "*" else [o.strip() for o in CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Supabase helper (REST via PostgREST with service role)
# ---------------------------------------------------------------------------
def sb_headers() -> dict[str, str]:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(500, "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados no backend")
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


async def sb_request(method: str, path: str, **kwargs: Any) -> Any:
    url = f"{SUPABASE_URL}/rest/v1{path}"
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.request(method, url, headers=sb_headers(), **kwargs)
        if r.status_code >= 400:
            try:
                detail = r.json()
            except Exception:
                detail = r.text
            raise HTTPException(r.status_code, detail)
        if r.status_code == 204 or not r.content:
            return None
        return r.json()


async def sb_upload(bucket: str, object_path: str, data: bytes, content_type: str) -> str:
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{object_path}"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, headers=headers, content=data)
        if r.status_code >= 400:
            raise HTTPException(r.status_code, r.text)
    return f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{object_path}"


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def is_admin_email(email: Optional[str]) -> bool:
    return bool(email and email.lower() in ADMIN_EMAILS)


async def upsert_profile_from_emergent(user: dict[str, Any]) -> dict[str, Any]:
    email = (user.get("email") or "").lower()
    full_name = user.get("name") or email.split("@")[0]
    picture = user.get("picture")

    existing = await sb_request("GET", f"/profiles?email=eq.{email}&select=*&limit=1")
    if existing:
        p = existing[0]
        # Promote to admin if allowlisted, keep admin if already admin
        role = "admin" if (is_admin_email(email) or p.get("role") == "admin") else "user"
        patch = {"picture": picture, "role": role, "updated_at": datetime.now(timezone.utc).isoformat()}
        if not p.get("avatar_url") and picture:
            patch["avatar_url"] = picture
        await sb_request("PATCH", f"/profiles?id=eq.{p['id']}", json=patch)
        p.update(patch)
        return p

    new_profile = {
        "email": email,
        "full_name": full_name,
        "nickname": full_name.split(" ")[0],
        "username": email.split("@")[0].replace(".", "").replace("+", "")[:24],
        "avatar_url": picture,
        "picture": picture,
        "role": "admin" if is_admin_email(email) else "user",
    }
    created = await sb_request("POST", "/profiles", json=new_profile)
    return created[0] if isinstance(created, list) else created


async def resolve_session(session_token: Optional[str]) -> Optional[dict[str, Any]]:
    if not session_token:
        return None
    rows = await sb_request(
        "GET",
        f"/user_sessions?session_token=eq.{session_token}&select=session_token,user_id,expires_at",
    )
    if not rows:
        return None
    s = rows[0]
    expires_at = s["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        await sb_request("DELETE", f"/user_sessions?session_token=eq.{session_token}")
        return None
    profiles = await sb_request("GET", f"/profiles?id=eq.{s['user_id']}&select=*&limit=1")
    if not profiles:
        return None
    return profiles[0]


async def current_user(
    request: Request,
    session_token: Optional[str] = Cookie(default=None),
) -> dict[str, Any]:
    token = session_token
    if not token:
        auth = request.headers.get("authorization", "")
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    user = await resolve_session(token)
    if not user:
        raise HTTPException(401, "Não autenticado")
    return user


async def require_admin(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    if user.get("role") != "admin" and not is_admin_email(user.get("email")):
        raise HTTPException(403, "Apenas administradores")
    return user


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "vitoria-backend",
        "supabase_configured": bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY),
    }


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------
class SessionExchange(BaseModel):
    session_id: str


@app.post("/api/auth/session")
async def auth_session(body: SessionExchange, response: Response):
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(EMERGENT_AUTH_URL, headers={"X-Session-ID": body.session_id})
    if r.status_code != 200:
        raise HTTPException(401, f"Falha ao validar sessão: {r.text}")
    data = r.json()

    profile = await upsert_profile_from_emergent(data)
    token = data.get("session_token") or f"vit_{uuid.uuid4().hex}"
    expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    await sb_request(
        "POST",
        "/user_sessions",
        json={"session_token": token, "user_id": profile["id"], "expires_at": expires_at},
        headers={**sb_headers(), "Prefer": "resolution=merge-duplicates"},
    )

    response.set_cookie(
        key="session_token",
        value=token,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )

    # Send welcome email on first login (best-effort)
    try:
        send_email_async(
            to=profile["email"],
            subject="Bem-vindo à Vitória! 🍱",
            template="welcome.html",
            context={"name": profile.get("full_name") or profile.get("nickname") or "cliente"},
        )
    except Exception:
        pass

    return {
        "user": {
            "id": profile["id"],
            "email": profile["email"],
            "full_name": profile.get("full_name"),
            "nickname": profile.get("nickname"),
            "username": profile.get("username"),
            "avatar_url": profile.get("avatar_url") or profile.get("picture"),
            "role": profile.get("role", "user"),
            "loyalty_points": profile.get("loyalty_points", 0),
            "is_admin": profile.get("role") == "admin" or is_admin_email(profile.get("email")),
        }
    }


@app.get("/api/auth/me")
async def auth_me(user: dict[str, Any] = Depends(current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user.get("full_name"),
        "nickname": user.get("nickname"),
        "username": user.get("username"),
        "avatar_url": user.get("avatar_url") or user.get("picture"),
        "role": user.get("role", "user"),
        "loyalty_points": user.get("loyalty_points", 0),
        "is_admin": user.get("role") == "admin" or is_admin_email(user.get("email")),
    }


@app.post("/api/auth/logout")
async def auth_logout(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if session_token:
        try:
            await sb_request("DELETE", f"/user_sessions?session_token=eq.{session_token}")
        except Exception:
            pass
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
class ProfilePatch(BaseModel):
    nickname: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


@app.patch("/api/profile")
async def patch_profile(patch: ProfilePatch, user: dict[str, Any] = Depends(current_user)):
    data = {k: v for k, v in patch.model_dump().items() if v is not None}
    if not data:
        return user
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    updated = await sb_request("PATCH", f"/profiles?id=eq.{user['id']}", json=data)
    return updated[0] if isinstance(updated, list) else updated


@app.post("/api/profile/avatar")
async def upload_avatar(file: UploadFile = File(...), user: dict[str, Any] = Depends(current_user)):
    data = await file.read()
    ext = (file.filename or "avatar.jpg").rsplit(".", 1)[-1].lower()
    path = f"{user['id']}/avatar_{int(datetime.now().timestamp())}.{ext}"
    url = await sb_upload("avatars", path, data, file.content_type or "image/jpeg")
    await sb_request(
        "PATCH",
        f"/profiles?id=eq.{user['id']}",
        json={"avatar_url": url, "updated_at": datetime.now(timezone.utc).isoformat()},
    )
    return {"url": url}


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    qty: int
    ingredients: Optional[list[str]] = None


class OrderCreate(BaseModel):
    total: float
    items: list[OrderItem]
    note: Optional[str] = None


@app.post("/api/orders")
async def create_order(body: OrderCreate, user: dict[str, Any] = Depends(current_user)):
    payload = {
        "user_id": user["id"],
        "total": body.total,
        "items": [i.model_dump() for i in body.items],
        "status": "pending",
        "note": body.note,
    }
    created = await sb_request("POST", "/orders", json=payload)
    order = created[0] if isinstance(created, list) else created

    try:
        send_email_async(
            to=user["email"],
            subject=f"Pedido #{order['id'][:8].upper()} confirmado • Vitória",
            template="order_confirmation.html",
            context={
                "name": user.get("nickname") or user.get("full_name") or "cliente",
                "order_id": order["id"][:8].upper(),
                "items": [i.model_dump() for i in body.items],
                "total": f"R$ {body.total:.2f}".replace(".", ","),
                "note": body.note,
            },
        )
    except Exception:
        pass

    return order


@app.get("/api/orders")
async def list_orders(user: dict[str, Any] = Depends(current_user)):
    rows = await sb_request("GET", f"/orders?user_id=eq.{user['id']}&order=created_at.desc")
    return rows or []


@app.patch("/api/admin/orders/{order_id}")
async def admin_update_order(order_id: str, body: dict[str, Any], _: dict = Depends(require_admin)):
    status = body.get("status")
    rows = await sb_request("PATCH", f"/orders?id=eq.{order_id}", json={"status": status})
    order = rows[0] if isinstance(rows, list) and rows else None
    if order:
        try:
            users = await sb_request("GET", f"/profiles?id=eq.{order['user_id']}&select=email,nickname,full_name&limit=1")
            if users:
                send_email_async(
                    to=users[0]["email"],
                    subject=f"Pedido #{order['id'][:8].upper()} — {status} • Vitória",
                    template="order_status_update.html",
                    context={
                        "name": users[0].get("nickname") or users[0].get("full_name") or "cliente",
                        "order_id": order["id"][:8].upper(),
                        "status": status,
                        "total": f"R$ {float(order['total']):.2f}".replace(".", ","),
                    },
                )
        except Exception:
            pass
    return order


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------
class TestimonialCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    content: Optional[str] = None


@app.post("/api/testimonials")
async def create_testimonial(body: TestimonialCreate, user: dict[str, Any] = Depends(current_user)):
    payload = {"user_id": user["id"], "rating": body.rating, "content": (body.content or None)}
    created = await sb_request("POST", "/testimonials", json=payload)
    return created[0] if isinstance(created, list) else created


@app.delete("/api/testimonials/{tid}")
async def delete_testimonial(tid: str, user: dict[str, Any] = Depends(current_user)):
    is_admin = user.get("role") == "admin" or is_admin_email(user.get("email"))
    filt = f"id=eq.{tid}" if is_admin else f"id=eq.{tid}&user_id=eq.{user['id']}"
    await sb_request("DELETE", f"/testimonials?{filt}")
    return {"ok": True}


class TestimonialReply(BaseModel):
    reply: str


@app.post("/api/admin/testimonials/{tid}/reply")
async def reply_testimonial(tid: str, body: TestimonialReply, _: dict = Depends(require_admin)):
    patch = {"admin_reply": body.reply, "admin_reply_at": datetime.now(timezone.utc).isoformat()}
    rows = await sb_request("PATCH", f"/testimonials?id=eq.{tid}", json=patch)
    t = rows[0] if isinstance(rows, list) and rows else None
    if t:
        try:
            users = await sb_request("GET", f"/profiles?id=eq.{t['user_id']}&select=email,nickname,full_name&limit=1")
            if users:
                send_email_async(
                    to=users[0]["email"],
                    subject="A Vitória respondeu seu depoimento 💬",
                    template="testimonial_reply.html",
                    context={
                        "name": users[0].get("nickname") or users[0].get("full_name") or "cliente",
                        "rating": t["rating"],
                        "content": t.get("content") or "",
                        "reply": body.reply,
                    },
                )
        except Exception:
            pass
    return t


# ---------------------------------------------------------------------------
# Products (admin only)
# ---------------------------------------------------------------------------
@app.post("/api/admin/products")
async def create_product(body: dict[str, Any], _: dict = Depends(require_admin)):
    body.setdefault("active", True)
    created = await sb_request("POST", "/products", json=body)
    return created[0] if isinstance(created, list) else created


@app.patch("/api/admin/products/{pid}")
async def update_product(pid: str, body: dict[str, Any], _: dict = Depends(require_admin)):
    body["updated_at"] = datetime.now(timezone.utc).isoformat()
    rows = await sb_request("PATCH", f"/products?id=eq.{pid}", json=body)
    return rows[0] if isinstance(rows, list) and rows else None


@app.delete("/api/admin/products/{pid}")
async def delete_product(pid: str, _: dict = Depends(require_admin)):
    await sb_request("DELETE", f"/products?id=eq.{pid}")
    return {"ok": True}


@app.post("/api/admin/products/{pid}/image")
async def upload_product_image(pid: str, file: UploadFile = File(...), _: dict = Depends(require_admin)):
    data = await file.read()
    ext = (file.filename or "img.jpg").rsplit(".", 1)[-1].lower()
    path = f"{pid}/{int(datetime.now().timestamp())}.{ext}"
    url = await sb_upload("product-images", path, data, file.content_type or "image/jpeg")
    await sb_request("PATCH", f"/products?id=eq.{pid}", json={"image_url": url})
    return {"url": url}


@app.post("/api/admin/products/{pid}/ingredients")
async def create_ingredient(pid: str, body: dict[str, Any], _: dict = Depends(require_admin)):
    body["product_id"] = pid
    created = await sb_request("POST", "/product_ingredients", json=body)
    return created[0] if isinstance(created, list) else created


@app.patch("/api/admin/ingredients/{iid}")
async def update_ingredient(iid: str, body: dict[str, Any], _: dict = Depends(require_admin)):
    rows = await sb_request("PATCH", f"/product_ingredients?id=eq.{iid}", json=body)
    return rows[0] if isinstance(rows, list) and rows else None


@app.delete("/api/admin/ingredients/{iid}")
async def delete_ingredient(iid: str, _: dict = Depends(require_admin)):
    await sb_request("DELETE", f"/product_ingredients?id=eq.{iid}")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Settings & users (admin)
# ---------------------------------------------------------------------------
@app.patch("/api/admin/settings")
async def update_settings(body: dict[str, Any], _: dict = Depends(require_admin)):
    await sb_request(
        "POST",
        "/app_settings?on_conflict=key",
        json={"key": "main", "value": body, "updated_at": datetime.now(timezone.utc).isoformat()},
        headers={**sb_headers(), "Prefer": "resolution=merge-duplicates,return=representation"},
    )
    return body


@app.patch("/api/admin/users/{uid}/role")
async def update_user_role(uid: str, body: dict[str, Any], _: dict = Depends(require_admin)):
    role = body.get("role")
    if role not in ("admin", "user"):
        raise HTTPException(400, "role inválido")
    rows = await sb_request("PATCH", f"/profiles?id=eq.{uid}", json={"role": role})
    return rows[0] if isinstance(rows, list) and rows else None


# ---------------------------------------------------------------------------
# Site images upload (admin)
# ---------------------------------------------------------------------------
@app.post("/api/admin/site-images")
async def upload_site_image(slot: str, file: UploadFile = File(...), _: dict = Depends(require_admin)):
    data = await file.read()
    ext = (file.filename or "img.jpg").rsplit(".", 1)[-1].lower()
    path = f"{slot}/{int(datetime.now().timestamp())}.{ext}"
    url = await sb_upload("site-images", path, data, file.content_type or "image/jpeg")
    return {"url": url}


# ---------------------------------------------------------------------------
# AI helpers (Emergent LLM key)
# ---------------------------------------------------------------------------
class DescribeIn(BaseModel):
    name: str
    category: Optional[str] = None
    hint: Optional[str] = None


class BadgeIn(BaseModel):
    name: str
    description: Optional[str] = None


class AIReplyIn(BaseModel):
    author: str
    rating: int
    content: Optional[str] = None


async def _chat(system: str, user: str) -> str:
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "EMERGENT_LLM_KEY not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage  # type: ignore
    except Exception as exc:
        raise HTTPException(500, f"emergentintegrations indisponível: {exc}") from exc

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"vitoria-{uuid.uuid4()}",
        system_message=system,
    ).with_model("openai", "gpt-4o-mini")
    resp = await chat.send_message(UserMessage(text=user))
    return str(resp).strip()


@app.post("/api/ai/describe")
async def ai_describe(body: DescribeIn):
    system = "Você escreve descrições curtas (até 140 caracteres) de pratos brasileiros, apetitosas e específicas."
    prompt = f"Prato: {body.name}. Categoria: {body.category or 'marmita'}. Hint: {body.hint or ''}. Escreva a descrição."
    desc = await _chat(system, prompt)
    return {"description": desc.strip('"')}


@app.post("/api/ai/badge")
async def ai_badge(body: BadgeIn):
    system = "Você cria badges curtos (1-3 palavras) para produtos de restaurante. Ex: 'Mais Vendido', 'Novidade', 'Fit', 'Premium'."
    prompt = f"Produto: {body.name}. Descrição: {body.description or ''}. Dê 1 badge."
    badge = await _chat(system, prompt)
    return {"badge": badge.strip('"').strip()[:20]}


@app.post("/api/ai/reply-testimonial")
async def ai_reply(body: AIReplyIn):
    system = (
        "Você é o gerente do restaurante Vitória respondendo depoimentos em português do Brasil, "
        "caloroso, genuíno e breve (até 300 caracteres)."
    )
    prompt = f"Cliente: {body.author}. Nota: {body.rating}/5. Comentário: {body.content or '(sem texto)'}. Escreva a resposta."
    reply = await _chat(system, prompt)
    return {"reply": reply.strip('"')}


# ---------------------------------------------------------------------------
# Email sending (best-effort, SMTP optional)
# ---------------------------------------------------------------------------
def render_template(name: str, context: dict[str, Any]) -> str:
    path = EMAIL_DIR / name
    if not path.exists():
        return f"<pre>{json.dumps(context, ensure_ascii=False, indent=2)}</pre>"
    html = path.read_text(encoding="utf-8")
    # very small templating: {{var}} and {{#each items}} ... {{/each}}
    if "{{#each items}}" in html and "items" in context:
        start = html.index("{{#each items}}")
        end = html.index("{{/each}}")
        tpl = html[start + len("{{#each items}}") : end]
        rendered = "".join(
            tpl.replace("{{name}}", str(it.get("name", "")))
               .replace("{{qty}}", str(it.get("qty", "")))
               .replace("{{price}}", f"R$ {float(it.get('price', 0)) * int(it.get('qty', 1)):.2f}".replace(".", ","))
            for it in context["items"]
        )
        html = html[:start] + rendered + html[end + len("{{/each}}") :]
    for k, v in context.items():
        if k == "items":
            continue
        html = html.replace("{{" + k + "}}", str(v or ""))
    return html


def send_email_async(*, to: str, subject: str, template: str, context: dict[str, Any]) -> None:
    """Fire-and-forget email send. Logs if SMTP not configured."""
    body = render_template(template, context)
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS):
        print(f"[email:DRY-RUN] to={to} subject={subject}")
        return
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to
    msg.attach(MIMEText(body, "html", "utf-8"))
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.sendmail(SMTP_FROM, [to], msg.as_string())
    except Exception as e:
        print(f"[email:ERROR] {e}")
