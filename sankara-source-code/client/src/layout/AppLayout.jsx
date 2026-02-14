import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'receptionist', 'technician', 'doctor', 'billing'] },
    { path: '/register', label: 'Registration', icon: '➕', roles: ['admin', 'receptionist'] },
    { path: '/assign-tests', label: 'Assign Tests', icon: '📋', roles: ['admin', 'receptionist', 'technician'] },
    { path: '/screening', label: 'Screening', icon: '🔬', roles: ['admin', 'technician'] },
    { path: '/consultation', label: 'Consultation', icon: '👨‍⚕️', roles: ['admin', 'doctor'] },
    { path: '/billing', label: 'Billing', icon: '💰', roles: ['admin', 'billing'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-gray-700">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Sankara</h1>
              <p className="text-xs text-gray-400">EyeCare Pro</p>
            </div>
          </div>

          {user && (
            <div className="mb-8 p-4 bg-gradient-to-br from-gray-700/50 to-gray-600/30 rounded-xl border border-gray-600/30 backdrop-blur-sm animate-fade-in">
              <p className="text-sm font-semibold text-gray-100">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize mt-1">{user.role}</p>
            </div>
          )}

          <nav className="space-y-1 mb-8">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${location.pathname === item.path
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-auto w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all duration-300 hover:text-red-300 font-medium text-sm"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

