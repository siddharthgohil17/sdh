import AdminSidebar from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin | SmartDealsHub' };

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
