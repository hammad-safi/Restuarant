'use client';

import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function UserMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('authToken');
      localStorage.removeItem('rememberMe');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-50">
      <div className="p-4 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-900">Admin Name</p>
        <p className="text-xs text-slate-500">admin@restaurant.com</p>
      </div>
      <div className="py-2">
        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">account_circle</span>
          Profile
        </button>
        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">settings</span>
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
}
