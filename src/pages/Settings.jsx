import { useState } from 'react';
import { Save, Bell, Shield, Clock, MapPin, Database, Wifi, BellRing } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Panic Alert System',
    timezone: 'UTC-5',
    language: 'English',
    
    // Alert Settings
    criticalThreshold: 30,
    highThreshold: 60,
    mediumThreshold: 120,
    lowThreshold: 300,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundAlerts: true,
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 90,
    maxConcurrentUsers: 1000,
    
    // Security Settings
    sessionTimeout: 30,
    requireMFA: true,
    passwordPolicy: 'strong',
    ipWhitelist: '',
    
    // Integration Settings
    webhookUrl: '',
    apiRateLimit: 1000,
    enableWebhooks: false,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Shield },
    { id: 'alerts', name: 'Alert Settings', icon: Bell },
    { id: 'notifications', name: 'Notifications', icon: BellRing },
    { id: 'system', name: 'System', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Wifi },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Mock save functionality
    alert('Settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">System Name</label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => handleSettingChange('systemName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="UTC-5">UTC-5 (Eastern Time)</option>
            <option value="UTC-6">UTC-6 (Central Time)</option>
            <option value="UTC-7">UTC-7 (Mountain Time)</option>
            <option value="UTC-8">UTC-8 (Pacific Time)</option>
            <option value="UTC+0">UTC+0 (GMT)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
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

  const renderAlertSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Response Time Thresholds</h3>
        </div>
        <p className="text-sm text-yellow-700 mb-4">
          Set maximum response times for different alert priority levels. These thresholds help ensure timely emergency response.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Critical Priority (seconds)</label>
            <input
              type="number"
              value={settings.criticalThreshold}
              onChange={(e) => handleSettingChange('criticalThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">High Priority (seconds)</label>
            <input
              type="number"
              value={settings.highThreshold}
              onChange={(e) => handleSettingChange('highThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Medium Priority (seconds)</label>
            <input
              type="number"
              value={settings.mediumThreshold}
              onChange={(e) => handleSettingChange('mediumThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Low Priority (seconds)</label>
            <input
              type="number"
              value={settings.lowThreshold}
              onChange={(e) => handleSettingChange('lowThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive alerts and reports via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive real-time alerts in browser</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium">Sound Alerts</h3>
              <p className="text-sm text-gray-500">Play sound for new alerts</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Auto Backup</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
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
            onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max Concurrent Users</label>
          <input
            type="number"
            value={settings.maxConcurrentUsers}
            onChange={(e) => handleSettingChange('maxConcurrentUsers', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password Policy</label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          >
            <option value="basic">Basic (8+ characters)</option>
            <option value="strong">Strong (12+ chars, symbols, numbers)</option>
            <option value="very-strong">Very Strong (16+ chars, mixed case)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">IP Whitelist</label>
          <textarea
            value={settings.ipWhitelist}
            onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
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
            onChange={(e) => handleSettingChange('requireMFA', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
        </label>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <input
            type="url"
            value={settings.webhookUrl}
            onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
            placeholder="https://api.example.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
          <input
            type="number"
            value={settings.apiRateLimit}
            onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
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
            onChange={(e) => handleSettingChange('enableWebhooks', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sidebar-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sidebar-primary"></div>
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'alerts': return renderAlertSettings();
      case 'notifications': return renderNotificationSettings();
      case 'system': return renderSystemSettings();
      case 'security': return renderSecuritySettings();
      case 'integrations': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

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
                    ? 'border-sidebar-primary text-sidebar-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}


