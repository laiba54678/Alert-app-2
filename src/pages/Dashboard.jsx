import { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, MapPin } from 'lucide-react';

import { apiClient } from "../services/api"; 

export default function Dashboard() {
  const [stats, setStats] = useState(null); 
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [agentActivity, setAgentActivity] = useState([]);

  useEffect(() => {
    // 1) Overview cards
    apiClient.get("/stats/overview")
      .then(res => {
        const d = res.data;
        setStats({
          totalUsers: d.total_users,
          totalAgents: d.total_agents,
          activeAlerts: d.active_alerts,
          resolvedAlerts: d.resolved_alerts
        });
      })
      .catch(err => console.error("Error loading overview:", err));

    // 2) Recent alerts (pending list)
    apiClient.get("/alerts")
      .then(res => setRecentAlerts(res.data.items || []))
      .catch(err => console.error("Error loading recent alerts:", err));

    // 3) Agent activity (leaderboard)
    apiClient.get("/stats/agent-activity")
      .then(res => setAgentActivity(res.data.items || []))
      .catch(err => console.error("Error loading agent activity:", err));
  }, []);

  // Google Maps Component
  const GoogleMapComponent = () => {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Locations</h3>
        <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyCr9GzHyFn8OGYSJRv4NO4gF3wiHb3_S6w&center=37.4219998,-122.084000&zoom=15&maptype=roadmap`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
          
          {/* Alert markers overlay */}
          {recentAlerts.length > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
              <h4 className="font-semibold text-sm mb-2">Active Alerts</h4>
              <div className="space-y-1">
                {recentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.status === "pending" ? "bg-red-500" :
                      alert.status === "accepted" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <span className="font-medium">{alert.alert_type}</span>
                    <span className="text-gray-500">
                      {alert.location ? `${alert.location.lat.toFixed(3)}, ${alert.location.lng.toFixed(3)}` : "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers ?? "-"}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAgents ?? "-"}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5% from last month
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{stats?.activeAlerts ?? "-"}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            Real-time updates
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Alerts</p>
              <p className="text-2xl font-bold text-green-600">{stats?.resolvedAlerts ?? "-"}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +18% from last month
          </div>
        </div>
      </div>

      {/* Google Maps Section - Replaces the charts */}
      <GoogleMapComponent />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-gray-500">No alerts yet.</p>
            ) : (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.status === "pending" ? "bg-red-500" :
                      alert.status === "accepted" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{alert.alert_type}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {alert.location ? `${alert.location.lat}, ${alert.location.lng}` : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.status === "pending" ? "bg-red-100 text-red-800" :
                      alert.status === "accepted" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Activity</h3>
          <div className="space-y-3">
            {agentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet.</p>
            ) : (
              agentActivity.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{agent.agent_email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {agent.resolved} resolved
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}