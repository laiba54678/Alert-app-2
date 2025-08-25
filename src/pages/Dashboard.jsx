import { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

import { apiClient } from "../services/api"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState(null); 
const [alertTrendData, setAlertTrendData] = useState({ labels: [], datasets: [] });
const [alertTypeData, setAlertTypeData] = useState({ labels: [], datasets: [] });
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

  // 2) Line chart (trends)
  apiClient.get("/stats/alert-trends?days=7")
    .then(res => {
      const items = res.data.items || [];
      setAlertTrendData({
        labels: items.map(i => i.day),
        datasets: [
          {
            label: "Active Alerts",
            data: items.map(i => i.active),
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            tension: 0.4,
          },
          {
            label: "Resolved Alerts",
            data: items.map(i => i.resolved),
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
          },
        ],
      });
    })
    .catch(err => console.error("Error loading trends:", err));

  // 3) Doughnut (alert types)
  apiClient.get("/stats/alert-types?days=7")
    .then(res => {
      const items = res.data.items || [];
      setAlertTypeData({
        labels: items.map(i => i.alert_type),
        datasets: [
          {
            data: items.map(i => i.count),
            backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#6B7280"],
          },
        ],
      });
    })
    .catch(err => console.error("Error loading types:", err));

  // 4) Recent alerts (pending list)
  apiClient.get("/alerts")
    .then(res => setRecentAlerts(res.data.items || []))
    .catch(err => console.error("Error loading recent alerts:", err));

  // 5) Agent activity (leaderboard)
  apiClient.get("/stats/agent-activity")
    .then(res => setAgentActivity(res.data.items || []))
    .catch(err => console.error("Error loading agent activity:", err));
}, []);





  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
           <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers ?? "-"}</p>
              {/* <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p> */}
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAgents ?? "-"}</p>
              {/* <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p> */}
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
             <p className="text-2xl font-bold text-red-600">{stats?.activeAlerts ?? "-"}</p>

              {/* <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p> */}
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
             <p className="text-2xl font-bold text-green-600">{stats?.resolvedAlerts ?? "-"}</p>
              {/* <p className="text-2xl font-bold text-green-600">{stats.resolvedAlerts}</p> */}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Alert Trends (Weekly)</h3>
          <Line data={alertTrendData} options={chartOptions} />
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Alert Types Distribution</h3>
          <Doughnut data={alertTypeData} options={doughnutOptions} />
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Response Time by Hour</h3>
        {/* <Bar data={responseTimeData} options={chartOptions} /> */}
      </div>

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


