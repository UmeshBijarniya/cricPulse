import { useMatchStore } from '../store/useMatchStore';
import type { SocketMessage } from '../types/cricket';

class SocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 8;
  private baseReconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isManuallyClosed = false;

  public connect() {
    this.isManuallyClosed = false;

    // Support VITE_WS_URL environment variable or fallback to local/same-origin host
    const envWs = import.meta.env.VITE_WS_URL;
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const wsUrl = envWs || (isLocalDev && window.location.port !== '4000'
      ? 'ws://localhost:4000/ws'
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);

    console.log(`[CricPulse WS] Connecting to ${wsUrl}...`);
    useMatchStore.getState().setConnectionStatus('connecting');

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[CricPulse WS] Connected successfully');
        this.reconnectAttempts = 0;
        useMatchStore.getState().setConnectionStatus('connected');
        useMatchStore.getState().setError(null);
        this.startHeartbeat();
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const message: SocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error('[CricPulse WS] Message parse error:', err);
        }
      };

      this.socket.onclose = (event) => {
        console.warn(`[CricPulse WS] Connection closed (code: ${event.code})`);
        this.stopHeartbeat();
        if (!this.isManuallyClosed) {
          this.handleReconnection();
        }
      };

      this.socket.onerror = (err) => {
        console.error('[CricPulse WS] Socket error:', err);
      };
    } catch (err: any) {
      console.error('[CricPulse WS] Immediate connection error:', err);
      this.handleReconnection();
    }
  }

  private handleMessage(message: SocketMessage) {
    const store = useMatchStore.getState();

    switch (message.type) {
      case 'MATCH_INIT':
        store.setMatch(message.payload);
        break;
      case 'BALL_UPDATE':
        store.onBallUpdate(message.payload.ball, message.payload.match);
        break;
      case 'OVER_COMPLETED':
        store.onOverCompleted(
          message.payload.overNumber,
          message.payload.overSummary,
          message.payload.match
        );
        break;
      case 'WICKET_FALL':
        store.onWicketFall(message.payload);
        break;
      case 'MATCH_COMPLETED':
        store.onMatchCompleted(message.payload.winner, message.payload.match);
        break;
      case 'SIMULATION_STATE':
        if (store.match) {
          store.setMatch({
            ...store.match,
            isSimulating: message.payload.isSimulating,
            speedMs: message.payload.speedMs,
          });
        }
        break;
      case 'PONG':
        // Heartbeat confirmed
        break;
      default:
        console.log('[CricPulse WS] Unhandled message:', message);
    }
  }

  private handleReconnection() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[CricPulse WS] Max reconnect attempts reached. Setting offline.');
      useMatchStore.getState().setConnectionStatus('offline');
      useMatchStore.getState().setError('Live connection lost. Could not reach simulation server.');
      return;
    }

    this.reconnectAttempts += 1;
    useMatchStore.getState().setConnectionStatus('reconnecting');

    const delay = Math.min(
      15000,
      this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1) + Math.random() * 500
    );

    console.log(`[CricPulse WS] Reconnecting in ${Math.round(delay)}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'PING' }));
      }
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public sendMessage(type: string, payload?: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('[CricPulse WS] Socket not open to send:', type);
    }
  }

  public disconnect() {
    this.isManuallyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    useMatchStore.getState().setConnectionStatus('offline');
  }
}

export const socketService = new SocketService();
