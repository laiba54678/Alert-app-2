import Sidebar from '../components/Sidebar.jsx';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


