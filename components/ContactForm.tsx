'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:col-span-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-surface-container-highest">
      <h2 className="font-display-lg text-display-lg text-primary mb-8">Send a Message</h2>
      
      {status.type && (
        <div className={`mb-6 p-4 rounded-2xl ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">Full Name</label>
            <input
              required
              className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
              placeholder="Zaid Khan"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">Email Address</label>
            <input
              required
              className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
              placeholder="zaid@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">How can we help?</label>
          <textarea
            required
            className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
            placeholder="Your message here..."
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
        <button
          disabled={loading}
          className={`w-full md:w-auto bg-primary text-on-primary px-12 py-4 rounded-2xl font-label-bold text-label-bold uppercase shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          type="submit"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
