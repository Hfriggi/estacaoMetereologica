from datetime import date, datetime, timedelta

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from typing import List
import os
from db import get_conn, get_environment
from migrate import run_migration
from objects.schemas import MedidaResponse
from objects.medidas import Medidas


# =========================
# App FastAPI
# =========================

app = FastAPI()

# Adiciona CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique o domínio do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# OPTIONS /medidas (CORS preflight)
# =========================
@app.options("/medidas")
def options_medidas():
    return {}


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

def verify_token(token: str = Header(...)):
    expected_token = os.getenv("API_TOKEN")

    if not expected_token:
        raise HTTPException(
            status_code=500,
            detail="API_TOKEN não configurado no servidor"
        )

    if token != expected_token:
        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )

# =========================
# GET /medidas
# =========================
@app.get("/medidas", response_model=List[MedidaResponse])
def listar_medidas(auth: None = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT *
                FROM medidas
                ORDER BY data DESC
            """)
            rows = cur.fetchall()

    return [MedidaResponse.from_db(r) for r in rows]

@app.get("/medidasLatest", response_model=MedidaResponse)
def listar_medida_latest(auth: None = Depends(verify_token)):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT *
                FROM medidas
                ORDER BY data DESC
                LIMIT 1
            """)
            row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Nenhuma medida encontrada")

    return MedidaResponse.from_db(row)

@app.get("/medidasByDay", response_model=List[MedidaResponse])
def listar_medidas_por_dia(
    data: date,
    auth: None = Depends(verify_token)
):
    data_inicio = datetime.combine(data, datetime.min.time())
    data_fim = data_inicio + timedelta(days=1)

    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT *
                FROM medidas
                WHERE data >= %s
                  AND data < %s
                ORDER BY data DESC
            """, (data_inicio, data_fim))
            rows = cur.fetchall()

    return [MedidaResponse.from_db(r) for r in rows]

# =========================
# POST /medidas
# =========================
@app.post("/medidas")
def inserir_medidas(med: Medidas, auth: None = Depends(verify_token)):
    payload = med.dict(exclude_none=True)

    if not payload:
        raise HTTPException(
            status_code=400,
            detail="É necessário informar ao menos um campo de medida"
        )

    cols = ", ".join(payload.keys())
    placeholders = ", ".join(["%s"] * len(payload))
    values = list(payload.values())

    sql = f"""
        INSERT INTO medidas ({cols})
        VALUES ({placeholders})
        RETURNING id;
    """

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, values)
            new_id = cur.fetchone()[0]
            conn.commit()

    return {"id": new_id}

# =========================
# DELETE /medidas
# =========================

@app.delete("/medidas")
def deletar_medidas_by_id(id: int, auth: None = Depends(verify_token)):
    sql = "DELETE FROM medidas WHERE id = %s;"

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (id,))
            deleted_count = cur.rowcount
            conn.commit()

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Medida não encontrada")

    return {"message": f"Medida com id {id} deletada com sucesso"}