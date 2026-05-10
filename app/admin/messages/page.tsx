'use client';

import { useState, useEffect } from 'react';
import { getContactMessages, markMessageRead, deleteMessage } from '@/lib/api';
import AdminPageLoader from '@/components/admin/AdminPageLoader';
import { format } from 'date-fns';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const res = await getContactMessages();
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await markMessageRead(id, !currentStatus);
      if (res.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  if (isLoading) return <AdminPageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-on-surface">Contact Inquiries</h2>
          <p className="font-body-md text-slate-500 mt-1">Manage customer messages and feedback.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-label-bold capitalize transition-all ${
                filter === f ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">mail</span>
            <h3 className="font-headline-md text-slate-400">No messages found</h3>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-md ${
                !msg.is_read ? 'border-primary border-l-8' : 'border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    !msg.is_read ? 'bg-primary text-on-primary' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-on-surface">{msg.name}</h4>
                    <p className="font-body-sm text-slate-500">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-slate-400">
                    {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                  </span>
                  <div className="flex items-center gap-1 ml-4">
                    <button 
                      onClick={() => handleToggleRead(msg.id, msg.is_read)}
                      className={`p-2 rounded-lg transition-colors ${
                        msg.is_read ? 'text-slate-400 hover:bg-slate-100' : 'text-primary hover:bg-primary/10'
                      }`}
                      title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <span className="material-symbols-outlined">
                        {msg.is_read ? 'drafts' : 'mail'}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="font-body-md text-on-surface whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
