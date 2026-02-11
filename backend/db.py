import os
import psycopg2
from pathlib import Path


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


def get_environment():
    return os.getenv("ENVIRONMENT", "dev").lower()


def get_database_url():
    env = get_environment()

    if env == "prod":
        return os.environ["DATABASE_URL_PROD"]
    else:
        return os.environ["DATABASE_URL_DEV"]


def get_conn():
    database_url = get_database_url()

    try:
        if get_environment() == "prod":
            return psycopg2.connect(database_url, sslmode="require")
        else:
            return psycopg2.connect(database_url)

    except Exception as e:
        print(f"❌ Erro ao conectar no banco: {e}")
        raise
