# Lead Manager Project

A comprehensive, full-stack application designed to capture, track, and manage business leads efficiently. This repository contains both the backend API built with modern asynchronous Python and an intuitive frontend interface powered by React and Vite.

---

## ðŸ—ï¸ Architecture Overview

The project is structured as a monorepo containing distinct backend and frontend components, configured for seamless local development and production deployment:

- **Backend**: FastPI API leveraging Python 3.13, asynchronous database interactions, automated data validation via Pydantic schemas, integrated AI functionalities, and full test coverage using Pytest.
- **Frontend**: A modern Single Page Application (SPA) built using React, Vite, and custom CSS styling, interacting with the backend services through a centralized API utility layer.
- **Deployment**: Multi-service orchestration ready via a unified `render.yaml` specification for easy hosting on Render.

---

## ðŸ“‚ Repository Structure

```text
Lead_Manager_Project-main/
â”œâ”€â”€ backend/                  # FastAPI Application
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ ai.py             # AI lead enrichment / processing logic
â”‚   â”‚   â”œâ”€â”€ database.py       # Async SQLAlchemy database setup
â”‚   â”‚   â”œâ”€â”€ main.py           # Application entrypoint & routes
â”‚   â”‚   â”œâ”€â”€ models.py         # SQLAlchemy ORM models
â”‚   â”‚   â””â”€â”€ schemas.py        # Pydantic validation schemas
â”‚   â”œâ”€â”€ .env.example          # Template for backend environment variables
â”‚   â”œâ”€â”€ .python-version       # Python version specification (3.13)
â”‚   â”œâ”€â”€ pytest.ini            # Pytest configuration setup
â”‚   â”œâ”€â”€ requirements.txt      # Python package dependencies
â”‚   â””â”€â”€ test_api.py           # Comprehensive API suite test execution
â”œâ”€â”€ frontend/                 # React SPA
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ App.jsx           # Root application view layout
â”‚   â”‚   â”œâ”€â”€ api.js            # Unified API fetch interface handler
â”‚   â”‚   â”œâ”€â”€ main.jsx          # Vite React execution bootstrap
â”‚   â”‚   â””â”€â”€ styles.css        # Responsive dashboard design layouts
â”‚   â”œâ”€â”€ .env.example          # Frontend API connection template
â”‚   â”œâ”€â”€ index.html            # Core entry point template markup
â”‚   â”œâ”€â”€ package.json          # Node.js build configs & dependencies
â”‚   â””â”€â”€ package-lock.json     # Strict dependency lock tree
â”œâ”€â”€ DEPLOYMENT-CHECKLIST.md   # Detailed production release checklist
â”œâ”€â”€ render.yaml               # Infrastructure-as-code specification Blueprint
â””â”€â”€ README.md                 # Primary documentation manual
```

---

## ðŸš€ Getting Started

### Prerequisites
- **Python**: `^3.13`
- **Node.js**: `^18.0` or higher
- **Package Managers**: `pip` (Python) and `npm` (Node)

### ðŸ› ï¸ Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Set up virtual environment & install dependencies**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Open .env and populate your database and AI module credentials
   ```

4. **Run the local development server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be accessible at `http://localhost:8000` with interactive Docs located at `http://localhost:8000/docs`.*

5. **Running tests**:
   ```bash
   pytest
   ```

### ðŸ’» Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Ensure VITE_API_URL is pointing correctly (Default: http://localhost:8000)
   ```

4. **Launch the Vite development application server**:
   ```bash
   npm run dev
   ```
   *The interface will launch natively at `http://localhost:5173`.*

---

## â˜ï¸ Deployment

This project includes a pre-configured `render.yaml` template file at the root level. To launch this project onto production:
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **Blueprint Application** group from the dashboard panel.
3. Render will auto-discover the `render.yaml` manifest configurations to bootstrap the multi-tier static frontend host and the asynchronous FastAPI backend web service instantly.

*Refer to the detailed `DEPLOYMENT-CHECKLIST.md` at the project root for thorough pre-flight validation steps before releasing to live traffic.*
