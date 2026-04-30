'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="bg-[#f5f0e8] min-h-screen flex overflow-hidden">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="lg:ml-[210px] pt-[56px] pb-24 lg:pb-8 px-4 md:px-8 overflow-y-auto overflow-x-hidden min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
