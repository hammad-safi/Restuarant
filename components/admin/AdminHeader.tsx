'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import NotificationPanel from './NotificationPanel';
import { getNotifications } from '@/lib/api';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Orders Management',
  '/admin/menu': 'Menu Management',
  '/admin/deals': 'Deals & Promotions',
  '/admin/categories': 'Categories',
  '/admin/gallery': 'Gallery',
  '/admin/billing': 'Billing',
  '/admin/settings': 'Settings',
};

export default function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getNotifications();
        if (res.success && res.data) {
          const count = (res.data as any[]).filter(n => !n.is_read).length;
          setUnreadCount(count);
        }
      } catch (err) {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [notifOpen]);

  const title = (pathname && pageTitles[pathname as keyof typeof pageTitles]) || 'Admin Panel';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-210px)] bg-[#f5f0e8] border-b border-[#e2dbd0] flex items-center justify-between h-[56px] px-6 z-[150]">
      <div className="flex items-center gap-[14px]">
        <button 
          onClick={onMenuClick}
          className="lg:hidden flex flex-col gap-[5px] p-1"
        >
          <span className="w-5 h-[2px] bg-[#555] rounded-[2px]" />
          <span className="w-5 h-[2px] bg-[#555] rounded-[2px]" />
          <span className="w-5 h-[2px] bg-[#555] rounded-[2px]" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#2d2d2d]">{title}</h1>
      </div>

      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen(!notifOpen);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-all relative"
          >
            <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] stroke-[#555] fill-none stroke-2 stroke-round stroke-linejoin">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-[7px] right-[7px] w-[9px] h-[9px] bg-[#e53e3e] rounded-full border-2 border-[#f5f0e8] animate-pulse" />
            )}
          </button>
          
          <NotificationPanel 
            isOpen={notifOpen} 
            onClose={() => setNotifOpen(false)} 
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-[#d4a843] text-[#1a1f2e] text-[13px] font-bold flex items-center justify-center hover:brightness-95 transition-all"
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl py-2 z-[500]">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-bold text-white">{user?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-white/40">{user?.email || user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-[#e53e3e] hover:bg-white/5 transition-colors flex items-center gap-2 text-[12px]"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

