'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDeals, createDeal, updateDeal, deleteDeal } from '@/lib/api';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  image_url: string;
  is_active: boolean;
}

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    image_url: '',
    is_active: true,
  });

  const loadDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDeals({ limit: 100 });
      if (response.success && response.data) {
        const dealsData = (response.data as any).deals || (response.data as any).items || [];
        setDeals(dealsData);
      }
    } catch (err) {
      console.error('Error loading deals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : undefined,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : undefined,
        image_url: formData.image_url,
        is_active: formData.is_active,
      };

      if (editingId) {
        const response = await updateDeal(editingId, data);
        if (response.success) {
          alert('Deal updated successfully!');
          loadDeals();
        }
      } else {
        const response = await createDeal(data);
        if (response.success) {
          alert('Deal created successfully!');
          loadDeals();
        }
      }

      setFormData({
        title: '',
        description: '',
        discount_percentage: '',
        discount_amount: '',
        image_url: '',
        is_active: true,
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      alert('Error saving deal');
      console.error(err);
    }
  };

  const handleEdit = (deal: Deal) => {
    setFormData({
      title: deal.title,
      description: deal.description,
      discount_percentage: deal.discount_percentage?.toString() || '',
      discount_amount: deal.discount_amount?.toString() || '',
      image_url: deal.image_url,
      is_active: deal.is_active,
    });
    setEditingId(deal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const response = await deleteDeal(id);
      if (response.success) {
        alert('Deal deleted successfully!');
        loadDeals();
      }
    } catch (err) {
      alert('Error deleting deal');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      image_url: '',
      is_active: true,
    });
  };

  return (
    <>
      {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-headline-md text-on-surface">Promotions & Deals</h2>
              <p className="text-on-surface-variant">Manage all your promotional offers</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined">add</span>
                Add Deal
              </button>
            )}
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
              <h3 className="font-headline-sm text-on-surface mb-4">
                {editingId ? 'Edit Deal' : 'Create New Deal'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 50% Off Burgers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Deal details"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount Amount (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount_amount}
                      onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-bold text-slate-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold hover:brightness-110 transition-all"
                  >
                    {editingId ? 'Update Deal' : 'Create Deal'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-label-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Deals Table */}
          {isLoading ? (
            <AdminPageLoader />
          ) : deals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
              <p className="text-on-surface-variant mb-4">No deals created yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold"
              >
                Create Your First Deal
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 font-label-bold text-slate-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 font-label-bold text-slate-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 font-label-bold text-slate-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 font-label-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 font-label-bold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{deal.title}</td>
                        <td className="px-6 py-4 text-slate-600 truncate max-w-xs">
                          {deal.description}
                        </td>
                        <td className="px-6 py-4 text-slate-900">
                          {deal.discount_percentage && `${deal.discount_percentage}%`}
                          {deal.discount_amount && `PKR ${deal.discount_amount}`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              deal.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {deal.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      )}
    </>
  );
}
