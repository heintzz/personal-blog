import { Menu } from 'lucide-react';
import React from 'react';

export default function TopBar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 mx-4 md:mx-6"></div>
      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm">
        AD
      </div>
    </div>
  );
}
