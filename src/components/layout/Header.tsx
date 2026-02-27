import { useState } from 'react';
import { Menu, Bell, Search, Plus, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { formatRelativeTime } from '../../utils/helpers';
import { mockActivity } from '../../data/mockData';

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

export default function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{pageTitle}</h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contenido..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* New post button */}
        <button
          className="btn-primary btn-sm hidden sm:flex"
          onClick={() => navigate('/posts/new')}
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva entrada
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Notificaciones</h3>
                <span className="badge-blue text-xs">3 nuevas</span>
              </div>
              <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {mockActivity.slice(0, 5).map(item => (
                  <li key={item.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <Avatar src={item.user.avatar} name={item.user.name} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">{item.user.name}</span>{' '}
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(item.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
            <span className="text-sm font-medium text-gray-700 hidden lg:block">{user?.name}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden lg:block ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 fade-in py-1">
              <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                <User className="w-4 h-4 text-gray-400" /> Mi perfil
              </button>
              <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                <Settings className="w-4 h-4 text-gray-400" /> Configuración
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifications(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  );
}
