import { useState, useEffect } from 'react';
import { Users, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalAgents: 42,
    activeAlerts: 8,
    resolvedAlerts: 234,
    responseTime: '2.3 min',
    coverageArea: '85%'
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'Medical Emergency', location: 'Downtown Mall', time: '2 min ago', status: 'active', priority: 'high' },
    { id: 2, type: 'Fire Alert', location: 'Industrial Zone', time: '5 min ago', status: 'active', priority: 'critical' },
    { id: 3, type: 'Traffic Accident', location: 'Highway 101', time: '8 min ago', status: 'assigned', priority: 'medium' },
    { id: 4, type: 'Power Outage', location: 'Residential Area', time: '12 min ago', status: 'resolved', priority: 'low' },
  ]);

  const [agentActivity, setAgentActivity] = useState([
    { name: 'Mike Johnson', status: 'Available', location: 'Downtown', lastActive: '2 min ago' },
    { name: 'Sarah Williams', status: 'On Call', location: 'North District', lastActive: '5 min ago' },
    { name: 'David Chen', status: 'Responding', location: 'South District', lastActive: '1 min ago' },
  ]);

  // Chart data
  const alertTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Alerts',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Resolved Alerts',
        data: [8, 15, 12, 20, 18, 25, 22],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const alertTypeData = {
    labels: ['Medical', 'Fire', 'Traffic', 'Security', 'Power', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 12, 5, 3],
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#6B7280',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const responseTimeData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Response Time (minutes)',
        data: [3.2, 2.8, 2.1, 1.9, 2.3, 2.7],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

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
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
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
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
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
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
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
              <p className="text-sm text-gray-600">Resolved Alerts</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedAlerts}</p>
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
        <Bar data={responseTimeData} options={chartOptions} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.priority === 'critical' ? 'bg-red-500' :
                    alert.priority === 'high' ? 'bg-orange-500' :
                    alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{alert.type}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {alert.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{alert.time}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800' :
                    alert.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Activity</h3>
          <div className="space-y-3">
            {agentActivity.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {agent.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    agent.status === 'Available' ? 'bg-green-100 text-green-800' :
                    agent.status === 'On Call' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {agent.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{agent.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


