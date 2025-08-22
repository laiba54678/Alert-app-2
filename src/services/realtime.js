export function connectAlerts(onMessage, onError) {
  const url = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/alerts';
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (e) {
      onError?.(e);
    }
  };

  socket.onerror = (e) => {
    onError?.(e);
  };

  return () => {
    try { socket.close(); } catch {}
  };
}


