All in one

A scaffolded all-in-one free online tools website built with React (Vite), Tailwind CSS, React Router, and a separate FastAPI backend.

## Frontend
- Vite + React + React Router
- Tailwind CSS styling
- Route-based tool pages under `/pdf-tools/`, `/image-tools/`, `/text-tools/`, `/calculators/`, and `/generators/`
- Shared layout with header/footer and placeholder tool pages
- Meta tag support via `react-helmet-async`
- Sitemap generation script at `scripts/generate-sitemap.mjs`

## Backend
- FastAPI app in `backend/`
- Health check endpoint: `/health`

## Commands
- Install dependencies: `npm install`
- Start frontend: `npm run dev`
- Generate sitemap: `npm run sitemap`
- Start backend: `uvicorn backend.main:app --reload --port 8000`
