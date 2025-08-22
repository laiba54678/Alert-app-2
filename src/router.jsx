import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Agents from './pages/Agents.jsx';
import Alerts from './pages/Alerts.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';
import DataManager from './components/DataManager.jsx';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'agents', element: <Agents /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
      { path: 'data-manager', element: <DataManager /> },
    ],
  },
]);


