# migrate.py
from db import get_conn

def run_migration():
    sql = """
    CREATE TABLE IF NOT EXISTS medidas (
        id SERIAL PRIMARY KEY,
        data TIMESTAMP NOT NULL,

        temp1 NUMERIC(6,2),
        temp2 NUMERIC(6,2),
        temp3 NUMERIC(6,2),
        temp4 NUMERIC(6,2),

        umid1 NUMERIC(6,2),
        umid2 NUMERIC(6,2),
        umid3 NUMERIC(6,2),

        press1 NUMERIC(7,2),
        press2 NUMERIC(7,2),
        press3 NUMERIC(7,2),

        lum NUMERIC(8,2),
        vel_vent NUMERIC(6,2),
        dir_vent NUMERIC(6,2)
    );
    """

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            conn.commit()

    print("Tabela 'medidas' criada/comprovada com sucesso!")

if __name__ == "__main__":
    run_migration()
