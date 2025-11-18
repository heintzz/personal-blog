'use client';

import { useState } from 'react';
import TopBar from './TopBar';

export default function MainMenu({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      {children}
    </div>
  );
}
