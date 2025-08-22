import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Database, Users, Shield, AlertTriangle } from 'lucide-react';

export default function DataManager() {
  const [activeTab, setActiveTab] = useState('users');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'users', name: 'Users', icon: Users, color: 'blue' },
    { id: 'agents', name: 'Agents', icon: Shield, color: 'green' },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle, color: 'red' },
  ];

  const userFields = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel', required: false },
    { key: 'role', label: 'Role', type: 'select', options: ['admin', 'user', 'moderator'], required: true },
    { key: 'department', label: 'Department', type: 'text', required: false },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'], required: true },
  ];

  const agentFields = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel', required: true },
    { key: 'specialization', label: 'Specialization', type: 'select', options: ['Fire Rescue', 'Medical Emergency', 'Police Support', 'Search & Rescue', 'Hazmat'], required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
    { key: 'availability', label: 'Availability', type: 'select', options: ['24/7', 'Day Shift', 'Night Shift', 'Weekends', 'On Call'], required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['available', 'on-call', 'unavailable'], required: true },
  ];

  const alertFields = [
    { key: 'type', label: 'Alert Type', type: 'select', options: ['Medical Emergency', 'Fire Alert', 'Traffic Accident', 'Security Threat', 'Power Outage', 'Natural Disaster'], required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'], required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'assigned', 'in-progress', 'resolved'], required: true },
  ];

  const getFields = () => {
    switch (activeTab) {
      case 'users': return userFields;
      case 'agents': return agentFields;
      case 'alerts': return alertFields;
      default: return userFields;
    }
  };

  const getInitialFormData = () => {
    const fields = getFields();
    const initialData = {};
    fields.forEach(field => {
      if (field.type === 'select') {
        initialData[field.key] = field.options[0];
      } else {
        initialData[field.key] = '';
      }
    });
    return initialData;
  };

  const handleAddNew = () => {
    setFormData(getInitialFormData());
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const fields = getFields();
    const requiredFields = fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.key]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Mock save functionality
    if (editingItem) {
      alert(`Updated ${activeTab.slice(0, -1)} successfully!`);
    } else {
      alert(`Added new ${activeTab.slice(0, -1)} successfully!`);
    }
    
    setShowForm(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({});
    setEditingItem(null);
  };

  const renderForm = () => {
    const fields = getFields();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
                      required={field.required}
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sidebar-primary focus:border-transparent"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
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
                className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingItem ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Data Management</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab.slice(0, -1)}
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
                    ? `border-${tab.color}-500 text-${tab.color}-600`
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
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-500 mb-6">
              Use this interface to add, edit, and manage your {activeTab} data. 
              Click "Add New {activeTab.slice(0, -1)}" to get started.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-3">Available Fields:</h4>
              <div className="text-left space-y-2">
                {getFields().map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${
                      field.required ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <span className="text-gray-600">{field.label}</span>
                    {field.required && <span className="text-red-500 text-xs">*</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && renderForm()}
    </div>
  );
}
