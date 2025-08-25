// src/pages/DataManager.jsx
import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Save, X, Database, Users, Shield, AlertTriangle } from "lucide-react";
import { apiClient } from "../services/api";

// ---------- Field sets (UI) ----------
const userFields = [
  { key: "name", label: "Full Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "role", label: "Role", type: "select", options: ["admin", "user", "moderator"], required: true },
  { key: "department", label: "Department", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["active", "inactive", "suspended"], required: true },
];

const agentFields = [
  { key: "name", label: "Full Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "specialization", label: "Specialization", type: "select", options: ["Fire Rescue", "Medical Emergency", "Police Support", "Search & Rescue", "Hazmat"], required: true },
  { key: "location", label: "Location", type: "text", required: true },
  { key: "availability", label: "Availability", type: "select", options: ["24/7", "Day Shift", "Night Shift", "Weekends", "On Call"], required: true },
  { key: "status", label: "Status", type: "select", options: ["available", "on-call", "unavailable"], required: true },
];

// Alerts in your backend use snake_case `alert_type` and nested `location {lat,lng}`.
// We'll keep the UI friendly and map it.
const alertFields = [
  { key: "type", serverKey: "alert_type", label: "Alert Type", type: "select", options: ["medical", "fire", "police", "utility"], required: true },
  // location in UI is "lat,lng"
  {
    key: "location",
    label: "Location (lat,lng)",
    type: "text",
    required: true,
    toServer: (v) => {
      // "37.4219983,-122.084" -> {lat: 37.4219983, lng: -122.084}
      if (!v) return undefined;
      const [latStr, lngStr] = String(v).split(",").map(s => s.trim());
      const lat = Number(latStr), lng = Number(lngStr);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
      return undefined;
    },
    fromServer: (v) => (v && typeof v === "object" && "lat" in v && "lng" in v ? `${v.lat}, ${v.lng}` : ""),
  },
  { key: "status", label: "Status", type: "select", options: ["pending", "assigned", "in-progress", "resolved"], required: true },
  { key: "sender_email", label: "Sender Email", type: "email", required: true },
];

// ---------- Config per tab ----------
const TAB_CONFIG = {
  users:  {
    icon: Users,  color: "blue",
    baseUrl: "/users",   idKey: "id",
    fields: userFields,  title: "Users",  singular: "user",
    listColumns: ["name", "email", "role", "status"],
    allowCreate: true, allowEdit: true, allowDelete: true
  },
  agents: {
    icon: Shield, color: "green",
    baseUrl: "/agents",  idKey: "id",
    fields: agentFields, title: "Agents", singular: "agent",
    listColumns: ["name", "email", "specialization", "status"],
    allowCreate: true, allowEdit: true, allowDelete: true
  },
  alerts: {
    icon: AlertTriangle, color: "red",
    baseUrl: "/alerts",  idKey: "id",
    fields: alertFields, title: "Alerts", singular: "alert",
    listColumns: ["alert_type", "sender_email", "status"],
    // many backends restrict creating alerts manually; flip to false if your POST /alerts is disabled
    allowCreate: true, allowEdit: true, allowDelete: true
  }
};

// ---------- Mapping helpers ----------
function uiFromServer(item, fields) {
  const ui = {};
  fields.forEach(f => {
    const k = f.serverKey || f.key;
    let v = item?.[k];
    if (f.fromServer) v = f.fromServer(v);
    ui[f.key] = v ?? "";
  });
  // always preserve id if present
  if (item?.id) ui.id = item.id;
  return ui;
}

function serverFromUI(ui, fields) {
  const body = {};
  fields.forEach(f => {
    let v = ui[f.key];
    if (f.toServer) v = f.toServer(v);
    const k = f.serverKey || f.key;
    if (v !== undefined) body[k] = v;
  });
  return body;
}

// ---------- Component ----------
export default function DataManager() {
  const [activeTab, setActiveTab] = useState("users");
  const cfg = useMemo(() => TAB_CONFIG[activeTab], [activeTab]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({}); // UI-shaped form data
  const [saving, setSaving] = useState(false);

  // initial & tab-change load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(cfg.baseUrl);
        const arr = res.data?.items || res.data || [];
        alive && setItems(Array.isArray(arr) ? arr : []);
      } catch (e) {
        console.error("Failed to load", cfg.baseUrl, e);
        alive && setItems([]);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [cfg.baseUrl]);

  // ----- form helpers -----
  function initialForm() {
    const o = {};
    cfg.fields.forEach(f => {
      if (f.type === "select") o[f.key] = f.options?.[0] ?? "";
      else o[f.key] = "";
    });
    return o;
  }

  function onAddNew() {
    setFormData(initialForm());
    setEditingItem(null);
    setShowForm(true);
  }

  function onEdit(item) {
    setEditingItem(item);
    setFormData(uiFromServer(item, cfg.fields));
    setShowForm(true);
  }

  async function onDelete(id) {
    if (!window.confirm(`Delete this ${cfg.singular}?`)) return;
    try {
      await apiClient.delete(`${cfg.baseUrl}/${id}`);
      setItems(prev => prev.filter(x => x[cfg.idKey] !== id));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check Network tab.");
    }
  }

  function validate(data) {
    const missing = cfg.fields.filter(f => f.required && !String(data[f.key] ?? "").trim());
    return missing.map(m => m.label);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const missing = validate(formData);
    if (missing.length) {
      alert(`Please fill required: ${missing.join(", ")}`);
      return;
    }
    const body = serverFromUI(formData, cfg.fields);
    try {
      setSaving(true);
      if (editingItem) {
        await apiClient.put(`${cfg.baseUrl}/${editingItem[cfg.idKey]}`, body);
      } else {
        await apiClient.post(cfg.baseUrl, body);
      }
      // reload list
      const res = await apiClient.get(cfg.baseUrl);
      setItems(res.data?.items || res.data || []);
      setShowForm(false);
      setEditingItem(null);
    } catch (e) {
      console.error("Save failed:", e);
      alert("Save failed. Check Network tab for details.");
    } finally {
      setSaving(false);
    }
  }

  // ----- UI -----
  const Tabs = Object.entries(TAB_CONFIG).map(([id, t]) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        activeTab === id
          ? `border-${t.color}-500 text-${t.color}-600`
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <t.icon className="w-4 h-4" />
      {t.title}
    </button>
  ));

  const showCreate = cfg.allowCreate !== false;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Management</h1>
        {showCreate && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New {cfg.singular}
          </button>
        )}
      </div>

      <div className="bg-white border rounded-lg">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">{Tabs}</nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading {cfg.title.toLowerCase()}…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{cfg.title} Management</h3>
              <p className="text-gray-500 mb-6">
                No {cfg.title.toLowerCase()} yet. {showCreate ? `Click "Add New ${cfg.singular}" to get started.` : ""}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {cfg.listColumns.map(col => (
                      <th key={col} className="px-4 py-2 text-left font-medium text-gray-600 capitalize">
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it[cfg.idKey]} className="border-b">
                      {cfg.listColumns.map(col => (
                        <td key={col} className="px-4 py-2">
                          {/* location special-case for alerts */}
                          {col === "location" && it.location?.lat != null && it.location?.lng != null
                            ? `${it.location.lat}, ${it.location.lng}`
                            : String(it[col] ?? "")}
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-2">
                          {cfg.allowEdit && (
                            <button
                              onClick={() => onEdit(it)}
                              className="p-1.5 border rounded hover:bg-gray-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {cfg.allowDelete && (
                            <button
                              onClick={() => onDelete(it[cfg.idKey])}
                              className="p-1.5 border rounded hover:bg-gray-50 text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Edit" : "Add New"} {cfg.singular}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cfg.fields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === "select" ? (
                      <select
                        value={formData[field.key] ?? ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
                        required={field.required}
                      >
                        {(field.options || []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key] ?? ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] ?? ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg disabled:opacity-60 hover:bg-red-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : editingItem ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
