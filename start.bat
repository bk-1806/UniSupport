@echo off
echo Starting UniSupport...

echo [1] Running Knowledge Deduplication...
cd backend\rag
python preprocess.py
cd ..\..

echo [2] Starting FastAPI Backend...
start cmd /k "cd backend && uvicorn main:app --reload --port 8080"

echo [3] Starting Next.js Frontend (Production)...
start cmd /k "cd frontend && npm run start"

echo All services started! Please visit http://localhost:3000 to use the application.
