# ASL Teacher App

## Overview
Web app to learn ASL with camera-based real-time feedback, scoring, and analytics.

## Quick start (local dev)

### Prereqs
- Docker & Docker Compose
- Node.js (optional if running frontend locally)
- Python 3.11 (optional if running backend locally)

### Start with Docker (recommended)
From project root:
```bash
docker-compose up --build

#ASL Teacher App

## Overview
Web app to learn ASL with camera-based real-time feedback, scoring, and analytics.

## Quick start (local dev)

### Prereqs
- Docker & Docker Compose
- Node.js (optional if running frontend locally)
- Python 3.11 (optional if running backend locally)

### Start with Docker (recommended)
From project root:
```bash
docker-compose up --build

project-root/
├── frontend/
├── backend/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── vite.config.mjs
└── .env
 
 Now,

This backend powers the ASL Teacher App, managing user test results and serving the built frontend.

---
- **Node.js** (v22)
- **Express.js** for REST APIs
- **PostgreSQL** for data storage
- **Docker** for containerization

---

## 🧩 Folder Structure
backend/
| └──app/
   └──crud.py
   └──database.py
   └──main.py
   └──models.py
   └──schemas.py
   └──requirements.txt
├── server.js # Main entry point
├── routers/ # API routes
│ └──auth.py
  └──tests.py
├── .dockerignore
├── package.json
└── .env


# ✋ ASL Teacher Frontend

Frontend for ASL Teacher App — allows users to learn, test, and track results for ASL gestures.

---
- **React (Vite)**
- **Tailwind CSS**
- **Fetch API** to communicate with the backend
- **Render/Docker** for deployment

---
## 🧩 Folder Structure
frontend/
| └──src/
   └──components/
        └──camerafeed.jsx
        └──gesturetrainer.jsx
        └──learnpage.jsx
        └──login.jsx
        └──resultcontext.jsx
        └──resultspage.jsx
        └──testflow.jsx
        └──ttsfeedback.jsx
├── app.jsx # Main entry point
├── main.jsx # API routes
|── styles.css
├── .dockerignore
├── package.json
└── .env
