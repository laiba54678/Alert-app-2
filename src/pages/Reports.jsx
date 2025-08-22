import { useState } from 'react';
import { Download, Calendar, FileText, BarChart3, TrendingUp, Filter } from 'lucide-react';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('alerts');
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    { id: 'alerts', name: 'Alert Reports', icon: FileText, description: 'Daily, weekly, and monthly alert summaries' },
    { id: 'agents', name: 'Agent Performance', icon: BarChart3, description: 'Response times, completion rates, and ratings' },
    { id: 'users', name: 'User Activity', icon: TrendingUp, description: 'User engagement and system usage statistics' },
    { id: 'system', name: 'System Health', icon: BarChart3, description: 'System performance and uptime metrics' },
  ];

  const generateReport = () => {
    // Mock report generation
    alert(`Generating ${selectedReport} report for ${dateRange} period...`);
  };

  const exportReport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => generateReport()}
            className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedReport === report.id
                  ? 'border-sidebar-primary bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.id ? 'bg-sidebar-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{report.name}</h3>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Date Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Quick Selection</label>
            <div className="flex gap-2">
              {['day', 'week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-sidebar-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Custom Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
              />
              <span className="flex items-center text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {reportTypes.find(r => r.id === selectedReport)?.name} Preview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => exportReport('PDF')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportReport('CSV')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        {/* Mock Report Content */}
        <div className="space-y-4">
          {selectedReport === 'alerts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Total Alerts</h3>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-700">+15% from last period</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900">Resolved</h3>
                <p className="text-2xl font-bold text-green-600">1,189</p>
                <p className="text-sm text-green-700">95.3% resolution rate</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900">Avg Response Time</h3>
                <p className="text-2xl font-bold text-orange-600">2.3 min</p>
                <p className="text-sm text-orange-700">-0.5 min improvement</p>
              </div>
            </div>
          )}

          {selectedReport === 'agents' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Agent</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Response Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Success Rate</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">Mike Johnson</td>
                      <td className="px-4 py-2">1.8 min</td>
                      <td className="px-4 py-2">98.5%</td>
                      <td className="px-4 py-2">4.8/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Sarah Williams</td>
                      <td className="px-4 py-2">2.1 min</td>
                      <td className="px-4 py-2">97.2%</td>
                      <td className="px-4 py-2">4.9/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">David Chen</td>
                      <td className="px-4 py-2">2.5 min</td>
                      <td className="px-4 py-2">96.8%</td>
                      <td className="px-4 py-2">4.7/5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900">Active Users</h3>
                <p className="text-2xl font-bold text-purple-600">1,156</p>
                <p className="text-sm text-purple-700">Daily active users</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-medium text-indigo-900">New Registrations</h3>
                <p className="text-2xl font-bold text-indigo-600">89</p>
                <p className="text-sm text-indigo-700">This month</p>
              </div>
            </div>
          )}

          {selectedReport === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900">Uptime</h3>
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-sm text-green-700">Last 30 days</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Avg Response</h3>
                <p className="text-2xl font-bold text-blue-600">45ms</p>
                <p className="text-sm text-blue-700">API response time</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900">Alerts</h3>
                <p className="text-2xl font-bold text-yellow-600">2</p>
                <p className="text-sm text-yellow-700">System warnings</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[
            { name: 'Weekly Alert Summary', type: 'PDF', date: '2024-01-15', size: '2.3 MB' },
            { name: 'Agent Performance Q4', type: 'Excel', date: '2024-01-10', size: '1.8 MB' },
            { name: 'System Health Report', type: 'PDF', date: '2024-01-05', size: '1.2 MB' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{report.type}</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


