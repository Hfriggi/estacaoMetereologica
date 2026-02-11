import os
import psycopg2
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
# Ambiente
# =========================
def get_environment():
    return os.getenv("ENVIRONMENT", "dev").lower()


# =========================
# Conexão com banco
# =========================
def get_conn():
    env = get_environment()

    if env == "prod":
        return psycopg2.connect(
            host="db.fcywmkuciwdoxdlayjaq.supabase.co",
            port=5432,
            dbname="postgres",
            user="postgres",
            password=os.getenv("PROD_DB_PASSWORD"),
            sslmode="require"
        )

    # DEV
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="estacao_meteo",
        user="meteo_user",
        password=os.getenv("DEV_DB_PASSWORD")
    )
