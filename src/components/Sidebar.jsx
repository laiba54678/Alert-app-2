import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Settings,
  ChevronRight,
  Database,
  LogOut,
} from "lucide-react";

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/agents", label: "Agents", icon: Shield },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/data-manager", label: "Data Manager", icon: Database },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/login", { replace: true }); // redirect to login
  };

  return (
    <div className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-sidebar-foreground">
            Panic Alert
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-sidebar-primary"
                          : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-200 ${
                        isActive
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              System Online
            </p>
            <p className="text-xs text-muted-foreground">All services active</p>
          </div>
        </div>

        {/* 🚀 Logout button */}
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-3 py-2 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
