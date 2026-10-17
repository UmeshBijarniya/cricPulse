chick to see live demo: https://cricpulse-602c.onrender.com

# 🏏 CricPulse — Live Cricket Match Center & Smart Analytics Tracker

A production-grade, intermediate-level real-time cricket match dashboard and smart analytics tracker built with **React 19**, **TypeScript**, **Tailwind CSS**, **Chart.js**, **Zustand**, and a **Node.js Express WebSocket** match simulation engine.

---

## 🌟 Highlights & Features

- **Live In-Memory Match Simulation Engine**:
  - Simulates a high-voltage T20 Final (**India chasing 185 vs Australia**).
  - Updates ball-by-ball every 3–4 seconds with realistic delivery outcomes, strike rotation, and bowler spell management.
- **Smart Win Probability Model**:
  - Calibrated logistic model factoring in Required Run Rate (RRR), Current Run Rate (CRR), balls remaining, and wickets in hand.
- **Interactive Chart.js Run-Rate Worm**:
  - Over-by-over worm trajectory comparing 1st innings vs 2nd innings with red dot markers for wickets fallen.
  - 1-click toggle between Cumulative Worm curve and Manhattan (Runs Per Over) bar chart.
- **Dynamic Ball-by-Ball Commentary Feed**:
  - Reverse-chronological timeline of deliveries with color-coded badges (Green for 4s, Purple for 6s, Red for Wickets, Amber for Extras).
  - Filter pills for All, Boundaries, or Wickets.
- **Full Scorecard Tab**:
  - Comprehensive batting & bowling breakdown table for both innings.
- **Resilient Connection Handling**:
  - Visual status indicators for `'connected'`, `'reconnecting'`, and `'offline'` with exponential backoff and heartbeats.
- **Interactive Match Controls**:
  - Play/Pause simulation, step forward one ball (+1 Ball), adjust speed (0.6x, 1.0x, 2.0x), or restart match.
- **Celebration Confetti**:
  - Automatic confetti explosion and trophy banner upon match conclusion.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Chart.js (`react-chartjs-2`), Zustand
- **Backend**: Node.js, Express, WebSockets (`ws`), tsx/TypeScript
- **Styling**: Clean Light Theme (Pure White `#FFFFFF`, Soft Slate `#F8FAFC`, Navy `#0F172A`, Stadium Green `#16A34A`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Install Dependencies
```bash
# In the project root:
npm install

# In the client directory:
cd client && npm install && cd ..

# In the server directory:
cd server && npm install && cd ..
```

### 2. Run in Development Mode
To start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173/` (or `http://localhost:5174/`)
- Backend REST API: `http://localhost:4000/api/match/current`
- WebSocket Server: `ws://localhost:4000/ws`

---

## 🚢 Deployment Guide

### Option 1: Unified Fullstack Deployment (Recommended — e.g. on Render / Railway)
Because the Express backend is configured to serve the built static client (`client/dist`) and handle WebSockets on the same port, you can deploy the entire app as a **single web service**:

1. **Push your code to GitHub** (follow the Git instructions below).
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**!
   - Your live CricPulse app will be available at `https://<your-app>.onrender.com` with both WebSockets and UI running seamlessly under one URL.

---

### Option 2: Split Deployment (Backend on Render, Frontend on Vercel)

#### Backend (Render):
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### Frontend (Vercel):
- **Root Directory**: `client`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL` = `https://<your-render-backend-url>`
  - `VITE_WS_URL` = `wss://<your-render-backend-url>/ws`
