'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSetting } from '@/lib/api';

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSettings();
      if (response.success && response.data) {
        setSettings(response.data as any);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const promises = Object.entries(settings).map(([key, value]) =>
        updateSetting(key, value)
      );
      await Promise.all(promises);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminPageLoader />;
  }

  return (
    <>
      <div className="mb-8">
            <h2 className="font-headline-lg text-on-surface">Brand Configuration</h2>
            <p className="font-body-md text-slate-500 mt-1">Manage your restaurant identity and public-facing contact information.</p>
          </div>

          {/* Bento Grid Form Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Brand Identity Section */}
            <section className="md:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">store</span>
                <h3 className="font-headline-md">Identity & Presence</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block font-label-bold text-on-surface-variant mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    value={settings.restaurant_name || ''}
                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label className="block font-label-bold text-on-surface-variant mb-2">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Short marketing tagline"
                  />
                </div>
                <div className="pt-2">
                  <label className="block font-label-bold text-on-surface-variant mb-3">Logo URL</label>
                  <input
                    type="text"
                    value={settings.logo_url || ''}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </section>

            {/* Brand Color Section */}
            <section className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">palette</span>
                <h3 className="font-headline-md">Visual Style</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block font-label-bold text-on-surface-variant mb-4">Primary Brand Color</label>
                  <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl">
                    <div 
                      className="w-16 h-16 rounded-full shadow-lg mb-4 ring-4 ring-white"
                      style={{ backgroundColor: settings.primary_color || '#1A362E' }}
                    ></div>
                    <input
                      type="text"
                      value={settings.primary_color || '#1A362E'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-full text-center bg-transparent font-stat-value text-primary border-none outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-2 font-medium">Applied to buttons & headers</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="md:col-span-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">contact_phone</span>
                <h3 className="font-headline-md">Contact Points</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-bold text-on-surface-variant mb-2">Phone</label>
                    <input 
                      type="text" 
                      value={settings.phone || ''} 
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-bold text-on-surface-variant mb-2">WhatsApp</label>
                    <input 
                      type="text" 
                      value={settings.whatsapp || ''} 
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-bold text-on-surface-variant mb-2">Physical Address</label>
                  <textarea
                    rows={3}
                    value={settings.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Social Media Section */}
            <section className="md:col-span-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">share</span>
                <h3 className="font-headline-md">Social Channels</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Instagram', key: 'social_instagram', color: '#E1306C' },
                  { label: 'Facebook', key: 'social_facebook', color: '#1877F2' },
                  { label: 'TikTok', key: 'social_tiktok', color: '#000000' },
                ].map((social) => (
                  <div key={social.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${social.color}20` }}>
                      <span className="material-symbols-outlined text-sm" style={{ color: social.color }}>
                        link
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={settings[social.key] || ''} 
                      onChange={(e) => handleInputChange(social.key, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" 
                      placeholder={social.label + ' handle'}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer Action */}
          <div className="mt-8 flex items-center justify-end border-t border-slate-200 pt-8 gap-4">
            <button 
              onClick={loadSettings}
              className="px-8 py-3 rounded-xl font-label-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-10 py-4 bg-primary-container text-on-primary-container rounded-xl font-headline-md shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
    </>
  );
}

