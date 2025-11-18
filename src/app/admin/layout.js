import AdminSidebar from '../components/AdminSidebar';
import MainMenu from '../components/MainMenu';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <MainMenu>{children}</MainMenu>
    </div>
  );
}
