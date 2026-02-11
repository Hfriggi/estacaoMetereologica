from fastapi import FastAPI
import psycopg2
import os
from migrate import run_migration
from pathlib import Path


# =========================
# Carregar .env manualmente
# =========================
def load_env(path=".env"):
    env_path = Path(path)

    if not env_path.exists():
        return

    with env_path.open() as f:
        for line in f:
            line = line.strip()

            if not line or line.startswith("#"):
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(key, value)


load_env()


# =========================
# App FastAPI
# =========================
app = FastAPI()


# =========================
# Startup: migration
# =========================
@app.on_event("startup")
def startup_event():
    run_migration()


# =========================
# Banco de dados
# =========================
def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


# =========================
# Endpoints
# =========================
@app.get("/medidas")
def listar_medidas():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM medidas ORDER BY data DESC LIMIT 100")
            rows = cur.fetchall()
    return rows
