'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('profileName') || '');
  }, []);

  return <AdminContext.Provider value={{ name, setName }}>{children}</AdminContext.Provider>;
}

export function useAdminHeader() {
  return useContext(AdminContext);
}
