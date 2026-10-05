# Even8 AI Event Lead Manager — Backend

FastAPI REST API for the Even8 technical assignment.

## Local setup

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
uvicorn app.main:app --reload
```

API: http://localhost:8000  
Swagger: http://localhost:8000/docs

SQLite is used locally by default. For production, set `DATABASE_URL` to a PostgreSQL connection string.
