import { useEffect, useState } from 'react';
import { connectAlerts } from '../services/realtime.js';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const disconnect = connectAlerts((msg) => {
      setAlerts((prev) => [msg, ...prev].slice(0, 100));
    });
    return disconnect;
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
      <div className="rounded-lg border">
        <div className="divide-y">
          {alerts.length === 0 ? (
            <p className="p-4 text-muted-foreground">Waiting for alerts…</p>
          ) : (
            alerts.map((a, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.title || 'New Alert'}</p>
                  <p className="text-sm text-muted-foreground">{a.description || JSON.stringify(a)}</p>
                </div>
                <div className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


