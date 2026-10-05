# Even8 AI Event Lead Manager

A small full-stack application for capturing and following up with people met at business events.

## What it covers

- Add, edit and delete event leads
- Search by name, company, email, event or notes
- Filter by follow-up status and event
- Store name, company, email, event, notes and follow-up status in a database
- AI interaction-note summarization
- AI follow-up email drafting
- Responsive UI with a lead detail panel
- FastAPI Swagger documentation

These features directly map to the technical assignment requirements.

## Architecture

```text
React + Vite frontend
        |
        | HTTP/JSON
        v
FastAPI backend  ---->  PostgreSQL (production)
        |
        +----> OpenAI API (AI summary / follow-up)

Local development uses SQLite automatically.
```

## Project structure

```text
.
├── backend/
│   ├── app/
│   │   ├── ai.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── .env.example
│   ├── .python-version
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

## 1. Prerequisites

Install:

- Python 3.13+
- Node.js 20+
- Git
- A GitHub account
- An OpenAI API key for the AI buttons

## 2. Run backend locally

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API will be at `http://localhost:8000` and Swagger at `http://localhost:8000/docs`.

For AI locally, put your key in `backend/.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

## 3. Run frontend locally

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, if `cp` is unavailable, use:

```powershell
Copy-Item .env.example .env
```

Open `http://localhost:5173`.

## 4. Test before deployment

1. Create a lead.
2. Refresh the browser and confirm it remains in the database.
3. Edit the lead.
4. Delete a test lead.
5. Search by name/company/event.
6. Change the status filter.
7. Select a lead and run **Summarize**.
8. Select a lead and run **Draft follow-up**.
9. Open `http://localhost:8000/docs` and confirm the API endpoints are visible.

## 5. GitHub

Create a **public** repository named something like `even8-ai-event-lead-manager`.

Do not commit `.env`, API keys, the SQLite database, or `node_modules`.

From the project root:

```bash
git init
git branch -M main
git add .
git commit -m "Build AI event lead manager"
git remote add origin https://github.com/YOUR-USERNAME/even8-ai-event-lead-manager.git
git push -u origin main
```

## 6. Deploy PostgreSQL on Render

1. Sign in to Render.
2. Create **New > PostgreSQL**.
3. Choose a database name such as `even8-leads-db`.
4. Create the database.
5. Copy the database's **internal connection string** for the backend service.

## 7. Deploy FastAPI on Render

Create **New > Web Service** and connect the GitHub repository.

Set the root directory to `backend`.

Use:

- Runtime: Python
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Environment variables:

```text
DATABASE_URL=<Render PostgreSQL internal connection string>
OPENAI_API_KEY=<your OpenAI API key>
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGINS=<temporary frontend URL or localhost while testing>
```

After deployment, test:

```text
https://YOUR-BACKEND.onrender.com/health
https://YOUR-BACKEND.onrender.com/docs
```

## 8. Deploy React frontend on Render

Create **New > Static Site** and connect the same GitHub repository.

Set root directory to `frontend`.

Use:

- Build command: `npm install && npm run build`
- Publish directory: `dist`

Environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Deploy the site.

If using client-side routing in a future version, add a Render rewrite from `/*` to `/index.html`. This current assignment is a single-page app, so no client-side route is required.

## 9. Final CORS update

After the frontend has its final URL, go back to the FastAPI Render service and change:

```text
CORS_ORIGINS=https://YOUR-FRONTEND.onrender.com
```

Redeploy the backend. Then open the frontend URL and test the complete flow again.

## 10. Final submission checklist

- [ ] Public GitHub repository
- [ ] Live frontend URL
- [ ] Backend `/health` works
- [ ] Backend `/docs` works
- [ ] Create/edit/delete works
- [ ] Search/filter works
- [ ] Data persists after refresh
- [ ] AI summary works
- [ ] AI follow-up works
- [ ] README explains setup and decisions
- [ ] No API keys or `.env` files are committed

## Key technical decisions

### Why React + Vite?
Small responsive UI with a simple build and deployment model.

### Why FastAPI?
Fast REST API development, automatic request validation and interactive Swagger documentation.

### Why PostgreSQL in production and SQLite locally?
SQLite keeps local setup very small; PostgreSQL is a better shared production database and is directly supported by Render.

### Why OpenAI API?
The assignment explicitly asks for a practical AI feature. The app keeps the AI scope focused on two useful actions: summarizing interaction notes and drafting a follow-up message.

### Why no authentication?
Authentication is not part of the assignment requirements. Keeping it out avoids spending the limited assignment time on non-scoring infrastructure.
