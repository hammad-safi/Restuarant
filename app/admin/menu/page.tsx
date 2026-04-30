'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenuItems, updateMenuItem, deleteMenuItem, getCategories, createMenuItem, uploadImage } from '@/lib/api';
import { TableSkeleton } from '@/components/admin/Skeleton';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category_name: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_hot: boolean;
  is_deal: boolean;
}

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function MenuPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    is_hot: false,
    is_deal: false,
  });

  const { data: menuItems = [], isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const res = await getMenuItems({ limit: 100 });
      return res.success ? ((res.data as any)?.items || []) : [];
    },
  });

  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res.success ? ((res.data as any)?.categories || (res.data as any)?.items || []) : [];
    },
  });

  const isLoading = isLoadingMenu || isLoadingCats;

  const createMutation = useMutation({
    mutationFn: (data: any) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await uploadImage(file);
      if (response.success && response.data?.url) {
        setFormData((prev) => ({ ...prev, image_url: response.data.url }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { is_available: !currentStatus } });
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error saving item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_hot: item.is_hot,
      is_deal: item.is_deal,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_available: true,
      is_hot: false,
      is_deal: false,
    });
  };

  const categoryColors: Record<string, string> = {
    Burgers: 'bg-orange-100 text-orange-800',
    Chicken: 'bg-amber-100 text-amber-800',
    Deals: 'bg-red-100 text-red-800',
    Sides: 'bg-slate-100 text-slate-800',
    Drinks: 'bg-blue-100 text-blue-800',
    Desserts: 'bg-pink-100 text-pink-800',
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h3 className="font-headline-lg text-on-surface mb-1">Item Inventory</h3>
              <p className="font-body-md text-on-surface-variant">
                Manage your menu items, pricing, and availability.
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined mr-2 text-lg">add</span>
                Add Item
              </button>
            )}
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
              <h3 className="font-headline-sm text-on-surface mb-4">
                {editingId ? 'Edit Item' : 'Add New Menu Item'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Zinger Burger"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Item Image</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Image URL or upload..."
                        />
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600">upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                      </div>
                      {isUploading && <p className="text-xs text-primary animate-pulse">Uploading to Cloudinary...</p>}
                      {formData.image_url && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-100 mt-2">
                          <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Item description..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-bold text-slate-700">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_hot}
                      onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })}
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-sm font-bold text-slate-700">🔥 Hot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_deal}
                      onChange={(e) => setFormData({ ...formData, is_deal: e.target.checked })}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm font-bold text-slate-700">🏷️ Deal</span>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-8 py-2 rounded-lg font-label-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    {editingId ? 'Update Item' : 'Create Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-slate-100 text-slate-600 px-8 py-2 rounded-lg font-label-bold hover:bg-slate-200 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Menu Items Table */}
          {isLoading ? (
            <AdminPageLoader />
          ) : menuItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-on-surface-variant font-body-lg">No menu items found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider">Price (PKR)</th>
                      <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider text-center">
                        Availability
                      </th>
                      <th className="px-6 py-4 font-label-bold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{item.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${categoryColors[item.category_name] || 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {item.category_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-on-surface">{item.price}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className={`px-4 py-2 rounded-lg font-label-bold text-sm transition-all ${item.is_available
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                          >
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
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
