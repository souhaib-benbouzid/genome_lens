#!/bin/sh
# entrypoint.sh — seed the database then hand off to Uvicorn.

# the script to immediately abort if any command fails. 
set -e

echo "[entrypoint] Seeding database (idempotent)…"
python -m app.seed

echo "[entrypoint] Starting Uvicorn…"
exec uvicorn app.main:app \
    --host  "${HOST:-0.0.0.0}" \
    --port  "${PORT:-8000}" \
    --workers "${WORKERS:-1}" \
    --no-access-log
