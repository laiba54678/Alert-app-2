import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { apiClient } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [lastFetchAt, setLastFetchAt] = useState(null);

  async function loadAlerts() {
    try {
      // NOTE: /alerts returns ONLY "pending" alerts in your backend
      const res = await apiClient.get("/alerts");
      setAlerts(res.data?.items ?? []);
      setError(null);
      setLastFetchAt(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("ALERTS POLL ERROR:", e);
      setError(e.message || "Failed to load alerts");
    }
  }

  useEffect(() => {
    loadAlerts();                       // first load
    const id = setInterval(loadAlerts, 3000); // poll every 3s
    return () => clearInterval(id);     // cleanup on unmount
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <div className="text-xs text-gray-500">
          {error ? (
            <span className="text-red-600">Error: {String(error)}</span>
          ) : lastFetchAt ? (
            <>Last update: {lastFetchAt}</>
          ) : (
            <>Loading…</>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="divide-y">
          {alerts.length === 0 ? (
            <p className="p-4 text-gray-500">
              No pending alerts. (Create one to test.)
            </p>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{a.alert_type}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {a.sender_email}
                    <span className="mx-1">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      a.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : a.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {a.status}
                    </span>
                    {a.location && (
                      <>
                        <span className="mx-1">•</span>
                        <MapPin className="w-3 h-3" />
                        {a.location.lat}, {a.location.lng}
                      </>
                    )}
                  </p>
                </div>
                {/* you can add action buttons here later */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
