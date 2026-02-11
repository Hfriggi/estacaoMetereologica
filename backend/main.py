from fastapi import FastAPI, HTTPException, status
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from db import get_environment
from objects.schemas import MedidaResponse
from typing import List
from migrate import run_migration
from pathlib import Path
from db import get_conn
from objects.medidas import Medidas


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
        env = get_environment()

        if env == "prod":
            print("🌎 Backend iniciado em PRODUÇÃO")
            print("🔐 Banco: SUPABASE")
        else:
            print("🧪 Backend iniciado em DESENVOLVIMENTO")
            print("💻 Banco: LOCAL")
        run_migration()

# =========================
# Endpoints
# =========================
@app.get("/medidas", response_model=list[MedidaResponse])
def listar_medidas():
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT *
                FROM medidas
                ORDER BY data DESC
            """)
            rows = cur.fetchall()

    resultado = []

    for r in rows:
        resultado.append({
            "id": r["id"],
            "data": r["data"],
            "temperatura": {
                "sensor1": r["temp1"],
                "sensor2": r["temp2"],
                "sensor3": r["temp3"],
                "sensor4": r["temp4"],
            },
            "umidade": {
                "sensor1": r["umid1"],
                "sensor2": r["umid2"],
                "sensor3": r["umid3"],
            },
            "pressao": {
                "sensor1": r["press1"],
                "sensor2": r["press2"],
                "sensor3": r["press3"],
            },
            "luminosidade": r["lum"],
            "vento": {
                "velocidade": r["vel_vent"],
                "direcao": r["dir_vent"],
            }
        })

    return resultado

@app.post("/medidas")
def inserir_medidas(med: Medidas):
    payload = med.dict(exclude_none=True)

    if not payload:
        raise HTTPException(status_code=404, detail="É necessário informar ao menos um campo de medida")

    cols = ", ".join(payload.keys())
    placeholders = ", ".join(["%s"] * len(payload))
    values = list(payload.values())

    sql = f"INSERT INTO medidas ({cols}) VALUES ({placeholders}) RETURNING id;"

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, values)
            new_id = cur.fetchone()[0]
            conn.commit()

    return {"id": new_id}
