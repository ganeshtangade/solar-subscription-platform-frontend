import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderSearch, Sun, Users, FileText, LogOut, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MENUS = {
  subscriber: [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/app/browse", label: "Browse Projects", icon: FolderSearch },
  ],
  farmer: [
    { to: "/farmer", label: "Dashboard", icon: LayoutDashboard, end: true },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  ],
};

const TITLES = { subscriber: "Subscriber", farmer: "Farmer Portal", admin: "Admin Panel" };

export default function Layout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const menu = MENUS[auth.role];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-slate-900 text-slate-200 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8">
          <Sun className="text-yellow-400" size={30} />
          <div>
            <p className="font-bold text-white leading-tight">SolarShare</p>
            <p className="text-xs text-slate-400">{TITLES[auth.role]}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive ? "bg-green-600 text-white" : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold">Welcome, {auth.user.name}! 👋</h1>
        <p className="text-slate-500 mb-6">Together we are building a cleaner and greener future.</p>
        <Outlet />
      </main>
    </div>
  );
}