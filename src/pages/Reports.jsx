import { useEffect, useMemo, useState } from "react";
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";
import { apiClient } from "../services/api";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("alerts");
  const [dateRange, setDateRange] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // data from backend
  const [alertsSummary, setAlertsSummary] = useState(null);   // { total_alerts, resolved, avg_response_minutes }
  const [agentActivity, setAgentActivity] = useState([]);     // [{ agent_email, resolved }]
  const [overview, setOverview] = useState(null);             // { total_users, total_agents, active_alerts, resolved_alerts }
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: "alerts", name: "Alert Reports", icon: FileText, description: "Totals and response time" },
    { id: "agents", name: "Agent Performance", icon: BarChart3, description: "Resolved counts per agent" },
    { id: "users",  name: "User Activity", icon: TrendingUp, description: "Users, agents, alerts totals" },
  ];

  // ---- helpers: compute from_/to for alert reports ----
  function toISODate(d) { return d.toISOString().slice(0, 10); }

  function computeRange() {
    // Custom range takes priority
    if (startDate || endDate) {
      const from = startDate ? startDate : toISODate(new Date(Date.now() - 7*24*3600*1000));
      const to   = endDate ? endDate : toISODate(new Date());
      return { from_, to };
    }
    // Quick presets
    const now = new Date();
    const to = toISODate(now);
    const start = new Date(now);
    const map = { day: 1, week: 7, month: 30, quarter: 90, year: 365 };
    start.setDate(start.getDate() - (map[dateRange] ?? 7));
    return { from_: toISODate(start), to };
  }

  // ---- fetch on tab/range change ----
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (selectedReport === "alerts") {
          const { from_, to } = computeRange();
          const res = await apiClient.get("/reports/alerts/summary", { params: { from_, to } });
          setAlertsSummary(res.data || null);
        } else if (selectedReport === "agents") {
          const res = await apiClient.get("/stats/agent-activity", { params: { limit: 20 } });
          setAgentActivity(res.data?.items ?? []);
        } else if (selectedReport === "users") {
          const res = await apiClient.get("/stats/overview");
          setOverview(res.data || null);
        }
      } catch (e) {
        console.error("Reports load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReport, dateRange, startDate, endDate]);

  // ---- export current view to CSV ----
  function exportCSV() {
    let csv = "";
    if (selectedReport === "alerts" && alertsSummary) {
      csv = "total_alerts,resolved,avg_response_minutes\n" +
            `${alertsSummary.total_alerts},${alertsSummary.resolved},${alertsSummary.avg_response_minutes ?? ""}\n`;
    } else if (selectedReport === "agents") {
      csv = "agent_email,resolved\n" +
            agentActivity.map(a => `${a.agent_email},${a.resolved}`).join("\n");
    } else if (selectedReport === "users" && overview) {
      csv = "total_users,total_agents,active_alerts,resolved_alerts\n" +
            `${overview.total_users},${overview.total_agents},${overview.active_alerts},${overview.resolved_alerts}\n`;
    } else {
      return;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selectedReport}_report.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // ui bits
  const isAlerts = selectedReport === "alerts";
  const isAgents = selectedReport === "agents";
  const isUsers  = selectedReport === "users";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report type cards */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedReport === r.id ? "border-sidebar-primary bg-red-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedReport === r.id ? "bg-sidebar-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                  <r.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{r.name}</h3>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date range (only matters for Alerts report) */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Date Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Quick Selection</label>
            <div className="flex gap-2">
              {["day", "week", "month", "quarter", "year"].map((r) => (
                <button
                  key={r}
                  onClick={() => { setDateRange(r); setStartDate(""); setEndDate(""); }}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    dateRange === r ? "bg-sidebar-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Quick range is used when no custom dates are set.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Custom Range</label>
            <div className="flex gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
              <span className="flex items-center text-gray-500">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {reportTypes.find((r) => r.id === selectedReport)?.name} Preview
          </h2>
          {loading && <span className="text-xs text-gray-500">Loading…</span>}
        </div>

        {/* Alerts report */}
        {isAlerts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Total Alerts</h3>
              <p className="text-2xl font-bold text-blue-600">{alertsSummary?.total_alerts ?? "-"}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Resolved</h3>
              <p className="text-2xl font-bold text-green-600">{alertsSummary?.resolved ?? "-"}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-900">Avg Response Time</h3>
              <p className="text-2xl font-bold text-orange-600">
                {alertsSummary?.avg_response_minutes != null ? `${alertsSummary.avg_response_minutes} min` : "-"}
              </p>
            </div>
          </div>
        )}

        {/* Agents report */}
        {isAgents && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Agent</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {agentActivity.length === 0 ? (
                  <tr><td className="px-4 py-3 text-sm text-gray-500" colSpan={2}>No data yet.</td></tr>
                ) : (
                  agentActivity.map((a) => (
                    <tr key={a.agent_email} className="border-b">
                      <td className="px-4 py-2">{a.agent_email}</td>
                      <td className="px-4 py-2">{a.resolved}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Users report */}
        {isUsers && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Total Users</h3>
              <p className="text-2xl font-bold text-purple-600">{overview?.total_users ?? "-"}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-indigo-900">Total Agents</h3>
              <p className="text-2xl font-bold text-indigo-600">{overview?.total_agents ?? "-"}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-900">Active Alerts</h3>
              <p className="text-2xl font-bold text-red-600">{overview?.active_alerts ?? "-"}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Resolved Alerts</h3>
              <p className="text-2xl font-bold text-green-600">{overview?.resolved_alerts ?? "-"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
