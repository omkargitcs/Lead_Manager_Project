# Deployment checklist

## Before GitHub

- [ ] Run backend syntax check: `python -m compileall -q backend/app`
- [ ] Run frontend locally with `npm install && npm run dev`
- [ ] Test CRUD
- [ ] Test search/filter
- [ ] Test both AI actions
- [ ] Confirm `.env` is ignored by Git
- [ ] Confirm no API key appears anywhere in the repo

## GitHub

- [ ] Create a **Public** repository
- [ ] Push `main`
- [ ] Open the repository in an incognito/private browser window and confirm it is public

## Render database

- [ ] Create PostgreSQL database
- [ ] Copy internal connection string

## Render backend

- [ ] Root directory: `backend`
- [ ] Build: `pip install -r requirements.txt`
- [ ] Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add DATABASE_URL
- [ ] Add OPENAI_API_KEY
- [ ] Add OPENAI_MODEL=gpt-4o-mini
- [ ] Add temporary CORS_ORIGINS
- [ ] Test `/health`
- [ ] Test `/docs`

## Render frontend

- [ ] Root directory: `frontend`
- [ ] Build: `npm install && npm run build`
- [ ] Publish: `dist`
- [ ] Add VITE_API_URL with backend URL
- [ ] Test live site

## Final connection

- [ ] Set backend CORS_ORIGINS to the final frontend URL
- [ ] Redeploy backend
- [ ] Test create/edit/delete
- [ ] Test search/filter
- [ ] Test AI summary
- [ ] Test AI follow-up

## Submission

- [ ] GitHub URL
- [ ] Live application URL
- [ ] README
- [ ] Optional 1–2 minute demo video
