"""Backend API tests for Vitória app.

Tests:
  - /api/health
  - /api/ai/describe (Emergent LLM key)
  - /api/ai/badge
  - /api/ai/reply-testimonial
  - PWA assets from public path (manifest.webmanifest, logo.png, sw.js)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://75c38e40-ecce-413b-8a11-bccbd9913954.preview.emergentagent.com",
).rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Health ----------------
class TestHealth:
    def test_health_ok(self, client):
        r = client.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "ok"
        assert data["service"] == "vitoria-backend"


# ---------------- AI endpoints ----------------
class TestAI:
    def test_describe_generates_text(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/describe",
            json={"name": "Marmita Fitness de Frango", "category": "Fitness"},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "description" in data
        assert isinstance(data["description"], str)
        assert len(data["description"]) > 10
        assert len(data["description"]) <= 240

    def test_badge_generates_short_text(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/badge",
            json={"name": "Feijoada Completa", "description": "Tradicional feijoada brasileira", "sales": 45},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "badge" in data
        assert isinstance(data["badge"], str)
        assert 1 <= len(data["badge"]) <= 24

    def test_reply_testimonial(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/reply-testimonial",
            json={"author": "Maria", "rating": 5, "content": "Comida maravilhosa!"},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "reply" in data
        assert isinstance(data["reply"], str)
        assert len(data["reply"]) > 0
        assert len(data["reply"]) <= 280

    def test_describe_requires_name(self, client):
        r = client.post(f"{BASE_URL}/api/ai/describe", json={}, timeout=15)
        # FastAPI returns 422 for validation error
        assert r.status_code == 422


# ---------------- PWA assets ----------------
class TestPWA:
    def test_manifest(self, client):
        r = client.get(f"{BASE_URL}/manifest.webmanifest", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "name" in data
        # Name should include "Vitória" / "Vitoria"
        assert "Vit" in data["name"]

    def test_logo_exists(self, client):
        r = client.get(f"{BASE_URL}/logo.png", timeout=15)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")

    def test_sw_exists(self, client):
        r = client.get(f"{BASE_URL}/sw.js", timeout=15)
        assert r.status_code == 200
        assert "service" in r.text.lower() or "cache" in r.text.lower() or len(r.text) > 10
