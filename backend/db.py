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

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])
