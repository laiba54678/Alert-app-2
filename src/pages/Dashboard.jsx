import { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, MapPin } from 'lucide-react';

// Mock API client for demonstration
const apiClient = {
  get: (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === "/stats/overview") {
          resolve({
            data: {
              total_users: 7,
              total_agents: 3,
              active_alerts: 49,
              resolved_alerts: 32
            }
          });
        } else if (endpoint === "/alerts") {
          resolve({
            data: {
              items: [
                {
                  id: 1,
                  alert_type: "gas leak",
                  status: "pending",
                  location: { lat: 37.4219998, lng: -122.084000 }
                },
                {
                  id: 2,
                  alert_type: "panic",
                  status: "accepted",
                  location: { lat: 37.4239998, lng: -122.086000 }
                },
                {
                  id: 3,
                  alert_type: "police",
                  status: "resolved",
                  location: { lat: 37.4199998, lng: -122.082000 }
                }
              ]
            }
          });
        } else if (endpoint === "/stats/agent-activity") {
          resolve({
            data: {
              items: [
                { agent_email: "agent1@example.com", resolved: 15 },
                { agent_email: "agent2@example.com", resolved: 12 },
                { agent_email: "agent3@example.com", resolved: 8 }
              ]
            }
          });
        }
      }, 1000);
    });
  }
};

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

  // Google Maps Component with markers
  const GoogleMapComponent = () => {
    // Create markers parameter for Google Maps
    const createMarkersParam = () => {
      if (recentAlerts.length === 0) return '';
      
      return recentAlerts
        .filter(alert => alert.location && alert.location.lat && alert.location.lng)
        .map((alert, index) => {
          const color = alert.status === "pending" ? "red" : 
                       alert.status === "accepted" ? "yellow" : "green";
          return `markers=color:${color}|label:${index + 1}|${alert.location.lat},${alert.location.lng}`;
        })
        .join('&');
    };

    const markersParam = createMarkersParam();
    const centerLat = recentAlerts.length > 0 && recentAlerts[0].location ? recentAlerts[0].location.lat : 37.4219998;
    const centerLng = recentAlerts.length > 0 && recentAlerts[0].location ? recentAlerts[0].location.lng : -122.084000;
    
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCr9GzHyFn8OGYSJRv4NO4gF3wiHb3_S6w&center=${centerLat},${centerLng}&zoom=13&maptype=roadmap${markersParam ? '&' + markersParam : ''}`;

    return (
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Locations</h3>
        <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
          
          {/* Alert markers legend overlay */}
          {recentAlerts.length > 0 && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Active Alerts on Map
              </h4>
              <div className="space-y-2">
                {recentAlerts.slice(0, 5).map((alert, index) => (
                  <div key={alert.id} className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        alert.status === "pending" ? "bg-red-500" :
                        alert.status === "accepted" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium capitalize">{alert.alert_type}</div>
                      <div className="text-gray-500">
                        {alert.location ? 
                          `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}` : 
                          "Unknown location"
                        }
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.status === "pending" ? "bg-red-100 text-red-700" :
                      alert.status === "accepted" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Status Colors:</div>
                <div className="flex space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Accepted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Resolved</span>
                  </div>
                </div>
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

      {/* Google Maps Section with Markers */}
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
              recentAlerts.map((alert, index) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        alert.status === "pending" ? "bg-red-500" :
                        alert.status === "accepted" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{alert.alert_type}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {alert.location ? 
                          `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}` : 
                          "Unknown"
                        }
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