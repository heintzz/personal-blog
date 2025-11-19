'use client';

import { AdminProvider } from '@/app/hooks/AdminHeaderContext';
import AdminSidebar from '../components/AdminSidebar';
import MainMenu from '../components/MainMenu';
import TopBar from '../components/TopBar';

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar />
        <MainMenu>
          <TopBar />
          {children}
        </MainMenu>
      </div>
    </AdminProvider>
  );
}
