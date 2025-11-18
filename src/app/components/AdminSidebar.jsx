'use client';

import { createClient } from '@/lib/supabase/client';
import { ChevronRight, FileText, Home, LogOut, Settings } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

const AdminSidebar = () => {
  const router = useRouter();
  const supabase = createClient();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div
      className={`fixed md:relative z-50 h-full bg-white border-r border-slate-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b md:h-[89px] border-slate-200 flex items-center">
        <div className="w-full flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-light tracking-tight text-black">Hasnan</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors md:block hidden"
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setSidebarOpen(false);
                redirect(`/admin/${item.id}`);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all ${
            sidebarOpen ? '' : 'justify-center'
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
