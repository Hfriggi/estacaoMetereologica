
# Backend Estação Meteorológica

## Rodar migrations
psql $DATABASE_URL -f migrations/001_create_medidas.sql

## Rodar API
uvicorn main:app --reload
