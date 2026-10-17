import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MatchSimulator } from './simulation/MatchSimulator.js';
import { SocketMessage } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const simulator = new MatchSimulator();

// Start simulation automatically on server boot
simulator.start();

// REST Endpoints
app.get('/api/match/current', (req, res) => {
  res.json({
    success: true,
    data: simulator.getState(),
  });
});

app.post('/api/match/toggle', (req, res) => {
  const isPlaying = simulator.togglePlay();
  res.json({
    success: true,
    isSimulating: isPlaying,
    data: simulator.getState(),
  });
});

app.post('/api/match/restart', (req, res) => {
  simulator.restart();
  res.json({
    success: true,
    message: 'Match restarted successfully',
    data: simulator.getState(),
  });
});

app.post('/api/match/speed', (req, res) => {
  const { speedMs } = req.body;
  if (typeof speedMs === 'number') {
    simulator.setSpeed(speedMs);
    res.json({ success: true, speedMs });
  } else {
    res.status(400).json({ success: false, error: 'speedMs must be a number' });
  }
});

app.post('/api/match/next-ball', (req, res) => {
  const newState = simulator.simulateNextBall();
  res.json({ success: true, data: newState });
});

// Serve static frontend build if present (Unified single-service deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Track connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Active clients: ${clients.size}`);

  // Send initial match state immediately upon connection
  const initMsg: SocketMessage = {
    type: 'MATCH_INIT',
    payload: simulator.getState(),
    timestamp: Date.now(),
  };
  ws.send(JSON.stringify(initMsg));

  // Handle client incoming messages
  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      } else if (data.type === 'TOGGLE_PLAY') {
        simulator.togglePlay();
      } else if (data.type === 'RESTART') {
        simulator.restart();
      } else if (data.type === 'SET_SPEED' && data.speedMs) {
        simulator.setSpeed(Number(data.speedMs));
      } else if (data.type === 'NEXT_BALL') {
        simulator.simulateNextBall();
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Active clients: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Client error:', err);
    clients.delete(ws);
  });
});

// Broadcast simulator events to all connected WebSocket clients
simulator.subscribe((type, payload) => {
  const message: SocketMessage = {
    type,
    payload,
    timestamp: Date.now(),
  };
  const serialized = JSON.stringify(message);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  }
});

server.listen(PORT, () => {
  console.log(`🏏 CricPulse Backend Server listening on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Server running on ws://localhost:${PORT}/ws`);
});
