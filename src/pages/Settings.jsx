// src/pages/Settings.jsx
import { useEffect, useMemo, useState } from "react";
import { Save, Bell, Shield, Clock, Wifi, BellRing, Database } from "lucide-react";
import { apiClient } from "../services/api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null); // {type:'success'|'error', text:string}

  // UI defaults (used until API responds, and as fallback)
  const defaults = {
    systemName: "Panic Alert System",
    timezone: "UTC",
    language: "English",
    alertTypes: ["medical", "fire", "police", "utility"],

    criticalThreshold: 30,
    highThreshold: 60,
    mediumThreshold: 120,
    lowThreshold: 300,

    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundAlerts: true,

    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 90,
    maxConcurrentUsers: 1000,

    sessionTimeout: 30,
    requireMFA: true,
    passwordPolicy: "strong",
    ipWhitelist: "",

    webhookUrl: "",
    apiRateLimit: 1000,
    enableWebhooks: false,
  };

  const [settings, setSettings] = useState(defaults);
  const [initialServerShape, setInitialServerShape] = useState(null); // exact last-saved server payload

  // server -> ui (snake_case to camelCase)
  const fromServer = (s = {}) => ({
    ...defaults,
    systemName: s.system_name ?? defaults.systemName,
    timezone: s.timezone ?? defaults.timezone,
    language: s.language ?? defaults.language,
    alertTypes: Array.isArray(s.alert_types) ? s.alert_types : defaults.alertTypes,

    criticalThreshold: s.critical_threshold ?? defaults.criticalThreshold,
    highThreshold: s.high_threshold ?? defaults.highThreshold,
    mediumThreshold: s.medium_threshold ?? defaults.mediumThreshold,
    lowThreshold: s.low_threshold ?? defaults.lowThreshold,

    emailNotifications: s.email_notifications ?? defaults.emailNotifications,
    smsNotifications: s.sms_notifications ?? defaults.smsNotifications,
    pushNotifications: s.push_notifications ?? defaults.pushNotifications,
    soundAlerts: s.sound_alerts ?? defaults.soundAlerts,

    autoBackup: s.auto_backup ?? defaults.autoBackup,
    backupFrequency: s.backup_frequency ?? defaults.backupFrequency,
    retentionDays: s.retention_days ?? defaults.retentionDays,
    maxConcurrentUsers: s.max_concurrent_users ?? defaults.maxConcurrentUsers,

    sessionTimeout: s.session_timeout ?? defaults.sessionTimeout,
    requireMFA: s.require_mfa ?? defaults.requireMFA,
    passwordPolicy: s.password_policy ?? defaults.passwordPolicy,
    ipWhitelist: s.ip_whitelist ?? defaults.ipWhitelist,

    webhookUrl: s.webhook_url ?? defaults.webhookUrl,
    apiRateLimit: s.api_rate_limit ?? defaults.apiRateLimit,
    enableWebhooks: s.enable_webhooks ?? defaults.enableWebhooks,
  });

  // ui -> server (camelCase to snake_case)
  const toServer = (u) => ({
    system_name: u.systemName,
    timezone: u.timezone,
    language: u.language,
    alert_types: u.alertTypes,

    critical_threshold: u.criticalThreshold,
    high_threshold: u.highThreshold,
    medium_threshold: u.mediumThreshold,
    low_threshold: u.lowThreshold,

    email_notifications: u.emailNotifications,
    sms_notifications: u.smsNotifications,
    push_notifications: u.pushNotifications,
    sound_alerts: u.soundAlerts,

    auto_backup: u.autoBackup,
    backup_frequency: u.backupFrequency,
    retention_days: u.retentionDays,
    max_concurrent_users: u.maxConcurrentUsers,

    session_timeout: u.sessionTimeout,
    require_mfa: u.requireMFA,
    password_policy: u.passwordPolicy,
    ip_whitelist: u.ipWhitelist,

    webhook_url: u.webhookUrl,
    api_rate_limit: u.apiRateLimit,
    enable_webhooks: u.enableWebhooks,
  });

  // Load /settings once
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/settings");
        const ui = fromServer(res.data || {});
        setSettings(ui);
        setInitialServerShape(toServer(ui));
      } catch (e) {
        console.error("Failed to load settings:", e);
        setBanner({ type: "error", text: "Couldn't load settings. Using defaults." });
        setInitialServerShape(toServer(defaults));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Are there unsaved changes?
  const isDirty = useMemo(() => {
    if (!initialServerShape) return false;
    try {
      const now = toServer(settings);
      return JSON.stringify(now) !== JSON.stringify(initialServerShape);
    } catch {
      return true;
    }
  }, [settings, initialServerShape]);

  const onChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setBanner(null);
    try {
      setSaving(true);
      const payload = toServer(settings);
      await apiClient.put("/settings", payload);
      setInitialServerShape(payload);
      setBanner({ type: "success", text: "Settings saved successfully." });
    } catch (e) {
      console.error("Save failed:", e);
      setBanner({ type: "error", text: "Save failed. Check Network tab or server logs." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialServerShape) return;
    setSettings(fromServer(initialServerShape));
    setBanner(null);
  };

  const tabs = [
    { id: "general", name: "General", icon: Shield },
    { id: "alerts", name: "Alert Settings", icon: Bell },
    { id: "notifications", name: "Notifications", icon: BellRing },
    { id: "system", name: "System", icon: Database },
    { id: "security", name: "Security", icon: Shield },
    { id: "integrations", name: "Integrations", icon: Wifi },
  ];

  // ---- Tab contents ----
  const General = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">System Name</label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => onChange("systemName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="UTC-5">UTC-5 (Eastern)</option>
            <option value="UTC-6">UTC-6 (Central)</option>
            <option value="UTC-7">UTC-7 (Mountain)</option>
            <option value="UTC-8">UTC-8 (Pacific)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => onChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const Alerts = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Response Time Thresholds</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["criticalThreshold", "Critical Priority (seconds)"],
            ["highThreshold", "High Priority (seconds)"],
            ["mediumThreshold", "Medium Priority (seconds)"],
            ["lowThreshold", "Low Priority (seconds)"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="number"
                value={settings[key]}
                onChange={(e) => onChange(key, Number(e.target.value || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Alert Types (saved to backend)</h3>
        <p className="text-sm text-gray-500 mb-2">Comma-separated list</p>
        <input
          type="text"
          value={settings.alertTypes.join(", ")}
          onChange={(e) =>
            onChange(
              "alertTypes",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
        />
      </div>
    </div>
  );

  const Notifications = () => (
    <div className="space-y-4">
      {[
        ["emailNotifications", "Email Notifications", "Receive alerts and reports via email"],
        ["smsNotifications", "SMS Notifications", "Receive critical alerts via SMS"],
        ["pushNotifications", "Push Notifications", "Receive real-time alerts in browser"],
        ["soundAlerts", "Sound Alerts", "Play sound for new alerts"],
      ].map(([key, title, desc]) => (
        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-sidebar-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      ))}
    </div>
  );

  const System = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="font-medium">Enable Auto Backup</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => onChange("autoBackup", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-sidebar-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => onChange("backupFrequency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Retention Period (days)</label>
          <input
            type="number"
            value={settings.retentionDays}
            onChange={(e) => onChange("retentionDays", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max Concurrent Users</label>
          <input
            type="number"
            value={settings.maxConcurrentUsers}
            onChange={(e) => onChange("maxConcurrentUsers", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const Security = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => onChange("sessionTimeout", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password Policy</label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => onChange("passwordPolicy", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="basic">Basic (8+ characters)</option>
            <option value="strong">Strong (12+ chars, symbols, numbers)</option>
            <option value="very-strong">Very Strong (16+ chars, mixed case)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">IP Whitelist</label>
          <textarea
            value={settings.ipWhitelist}
            onChange={(e) => onChange("ipWhitelist", e.target.value)}
            placeholder="Enter IP addresses (one per line)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="font-medium">Require Multi-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Enforce 2FA for all admin accounts</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireMFA}
            onChange={(e) => onChange("requireMFA", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-sidebar-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  );

  const Integrations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <input
            type="url"
            value={settings.webhookUrl}
            onChange={(e) => onChange("webhookUrl", e.target.value)}
            placeholder="https://api.example.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
          <input
            type="number"
            value={settings.apiRateLimit}
            onChange={(e) => onChange("apiRateLimit", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="font-medium">Enable Webhooks</h3>
            <p className="text-sm text-gray-500">Send real-time data to external systems</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableWebhooks}
            onChange={(e) => onChange("enableWebhooks", e.target.checked)}
            className="sr-only peer"
          />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-sidebar-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  );

  if (loading) return <div className="p-6">Loading settings…</div>;

  return (
    <div className="space-y-6">
      {/* Top header with Save */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            title="Revert your unsaved changes"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg disabled:opacity-60 hover:bg-red-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`px-4 py-3 rounded border ${
            banner.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
          role="status"
          aria-live="polite"
        >
          {banner.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border rounded-lg">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-sidebar-primary text-sidebar-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && <General />}
          {activeTab === "alerts" && <Alerts />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "system" && <System />}
          {activeTab === "security" && <Security />}
          {activeTab === "integrations" && <Integrations />}
        </div>
      </div>

      {/* Sticky bottom Save bar (shows only when dirty) */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 rounded-full bg-white border shadow px-4 py-2">
            <span className="text-sm text-gray-600">You have unsaved changes</span>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-1.5 rounded-full text-sm hover:bg-red-600"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
