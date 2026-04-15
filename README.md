# Movies WebApp

This project is a Netflix Clone with a split architecture (Frontend & Backend) optimized for high-performance streaming with Hindi dubbed support.

## Project Structure
- **/backend**: Express/Node.js server (Deploy on Render)
- **/frontend**: Vite/React application (Deploy on Vercel)

## Deployment Instructions

### 1. Backend (Render)
- Create a new **Web Service** on Render.
- Point to this repository.
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, `TMDB_API_KEY`, `NODE_ENV=production`, and `CLIENT_URL` (your vercel URL).

### 2. Frontend (Vercel)
- Import this repository on Vercel.
- Select the `frontend` directory as the project root.
- **Framework Preset**: Vite.
- **Environment Variables**: Add `VITE_API_URL` (your render service URL).

## Features
- Hindi Dubbed Hollywood Movies Search & Stream.
- Multiple streaming servers (Vidsrc.in, Vidsrc.cc, etc.).
- Premium movie trailer playback.
- Mobile responsive Netflix-inspired UI.
