#!/bin/sh
# entrypoint.dev.sh — load env vars, seed the database, then start Uvicorn locally.

set -e

echo "[entrypoint.dev] Seeding database (idempotent)…"
python -m app.seed

echo "[entrypoint.dev] Starting Uvicorn…"
exec uvicorn app.main:app \
    --host "${HOST:-0.0.0.0}" \
    --port "${PORT:-8000}" \
    --reload \
    --reload-dir ./app \
    --reload-include '*.py' \
    --no-access-log
