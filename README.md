# Xerox Shop SaaS MVP

A production-ready MVP connecting customers with local Xerox/print shops.

## Features
- **Customers**: Upload documents (PDF), choose print options, browse shops, place orders.
- **Shop Owners**: Create shop profile, manage incoming orders, update status.
- **Admin**: Full backend management via Django Admin.

## Tech Stack
- **Frontend**: React + Vite + Vanilla CSS
- **Backend**: Django + Django REST Framework
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **Auth**: JWT (SimpleJWT)

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## detailed Verification
See [walkthrough.md](C:\Users\0sush\.gemini\antigravity\brain\46cc2434-48bd-4a72-aecf-e48eb6a9f1a1\walkthrough.md) for step-by-step testing instructions.
