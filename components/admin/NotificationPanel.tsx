'use client';

import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'alert' | 'deal';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
}

export default function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'system'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order #1042 Received',
      description: '2× Classic Burger, 1× Fries — Table 4',
      time: '2 min ago',
      unread: true,
      icon: '🛒',
    },
    {
      id: '2',
      type: 'alert',
      title: 'Order #1039 Delayed',
      description: 'Kitchen flagged a delay for Table 7\'s order',
      time: '15 min ago',
      unread: true,
      icon: '⚠️',
    },
    {
      id: '3',
      type: 'deal',
      title: 'Deal "Weekend Special" is live',
      description: '20% off all burgers — active until Sunday',
      time: '1 hr ago',
      unread: true,
      icon: '🏷️',
    },
    {
      id: '4',
      type: 'system',
      title: 'Menu updated successfully',
      description: 'Category "Burgers" was modified',
      time: 'Yesterday, 4:32 PM',
      unread: false,
      icon: 'ℹ️',
    },
    {
      id: '5',
      type: 'order',
      title: 'Order #1028 Completed',
      description: 'Successfully delivered — Table 2',
      time: 'Yesterday, 1:10 PM',
      unread: false,
      icon: '🛒',
    },
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab || (activeTab === 'order' && n.type === 'alert');
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div
      ref={panelRef}
      className={`fixed top-[56px] right-4 w-[370px] max-w-[calc(100vw-24px)] bg-[#1a1f2e] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden z-[500] transition-all duration-200 ${
        isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-[-10px] scale-95 opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white tracking-[0.2px]">Notifications</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-[#d4a843] text-[#1a1f2e] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
          <button onClick={markAllRead} className="text-[#d4a843] text-[11px] opacity-85 hover:opacity-100 hover:underline">
            Mark all read
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 border-b border-white/10">
        {['all', 'order', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-[14px] py-[6px] text-[12px] capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'text-[#d4a843] border-[#d4a843]'
                : 'text-white/40 border-transparent hover:text-white/70'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'order' ? 'Orders' : 'System'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-[340px] overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-4 py-1.5 text-[10px] tracking-wider uppercase text-white/20">Today</div>
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex gap-3 px-4 py-3 cursor-pointer relative transition-colors hover:bg-white/5 ${
              n.unread ? 'bg-[#d4a843]/10' : ''
            }`}
          >
            {n.unread && (
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-[#d4a843] rounded-full" />
            )}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              n.type === 'order' ? 'bg-green-500/15' : 
              n.type === 'alert' ? 'bg-red-500/15' : 
              n.type === 'system' ? 'bg-blue-500/15' : 'bg-[#d4a843]/15'
            }`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] leading-[1.3] mb-0.5 font-medium ${n.unread ? 'text-white' : 'text-[#ddd]'}`}>
                {n.title}
              </div>
              <div className="text-[11.5px] text-white/40 truncate">{n.description}</div>
              <div className="text-[10.5px] text-white/25 mt-0.5">{n.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-center">
        <button className="text-[#d4a843] text-[12px] tracking-[0.4px] opacity-85 hover:opacity-100">
          View all notifications →
        </button>
      </div>
    </div>
  );
}
