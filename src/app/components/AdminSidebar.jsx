'use client';

import { useAdminHeader } from '@/app/hooks/AdminHeaderContext';
import { createClient } from '@/lib/supabase/client';

import { FileText, Home, LogOut, Menu, Settings, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminSidebar = () => {
  const { name } = useAdminHeader();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { id: 'articles', label: 'Articles', icon: FileText, path: '/admin/articles' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActiveRoute = (itemPath) => {
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleNavClick = (path) => {
    router.push(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        {!sidebarOpen && <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen z-30 bg-white border-r border-slate-200 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'w-64' : 'md:w-20'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center p-4 border-b border-slate-200 h-[73px] md:h-[89px]">
          {sidebarOpen ? (
            <div className="w-full items-center flex justify-between">
              <h1 className="text-xl font-bold  line-clamp-1">{name ? name : 'Admin'}</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <></>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:flex cursor-pointer items-center hover:bg-slate-100 rounded-lg transition-colors hidden"
          >
            {sidebarOpen ? <Menu size={20} /> : <Menu size={20} className="self-center" />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                  isActive ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
