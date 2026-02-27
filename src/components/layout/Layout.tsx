import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/posts': 'Entradas',
  '/posts/new': 'Nueva entrada',
  '/media': 'Biblioteca de medios',
  '/categories': 'Categorías',
  '/tags': 'Etiquetas',
  '/users': 'Usuarios',
  '/settings': 'Configuración',
  '/otros': 'Otros',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/posts/') && location.pathname !== '/posts/new') {
      return 'Editar entrada';
    }
    return pageTitles[location.pathname] || 'CMS';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          pageTitle={getPageTitle()}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
