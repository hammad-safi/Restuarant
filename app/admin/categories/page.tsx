'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  Burgers: 'bg-orange-100 text-orange-800 border-orange-300',
  Chicken: 'bg-amber-100 text-amber-800 border-amber-300',
  Deals: 'bg-red-100 text-red-800 border-red-300',
  Fries: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Drinks: 'bg-blue-100 text-blue-800 border-blue-300',
  Desserts: 'bg-pink-100 text-pink-800 border-pink-300',
  Sides: 'bg-slate-100 text-slate-800 border-slate-300',
};

import AdminPageLoader from '@/components/admin/AdminPageLoader';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    display_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategories();
      if (response.success && response.data) {
        setCategories((response.data as any).items || (response.data as any).categories || []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        display_order: formData.display_order || 0,
      };

      if (editingId) {
        const response = await updateCategory(editingId, data);
        if (response.success) {
          alert('Category updated successfully!');
          loadCategories();
        }
      } else {
        const response = await createCategory(data);
        if (response.success) {
          alert('Category created successfully!');
          loadCategories();
        }
      }

      setFormData({ name: '', slug: '', display_order: 0 });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      alert('Error saving category');
      console.error(err);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      display_order: category.display_order,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will not delete menu items in this category.')) return;

    try {
      const response = await deleteCategory(id);
      if (response.success) {
        alert('Category deleted successfully!');
        loadCategories();
      }
    } catch (err) {
      alert('Error deleting category');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', slug: '', display_order: 0 });
  };

  return (
    <>
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-headline-md text-on-surface">Food Categories</h2>
              <p className="text-on-surface-variant">Organize your menu items by category</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined">add</span>
                Add Category
              </button>
            )}
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
              <h3 className="font-headline-sm text-on-surface mb-4">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Burgers, Drinks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Slug (Auto-generated)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="burgers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold hover:brightness-110 transition-all"
                  >
                    {editingId ? 'Update Category' : 'Create Category'}
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

          {/* Categories Grid */}
          {isLoading ? (
            <AdminPageLoader />
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
              <p className="text-on-surface-variant mb-4">No categories created yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold"
              >
                Create Your First Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-lg ${categoryColors[category.name] || 'bg-white border-slate-100'
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-xs opacity-70">Slug: {category.slug}</p>
                    </div>
                    <span className="text-xs font-bold opacity-50">Order: {category.display_order}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 p-2 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 p-2 hover:bg-red-400/20 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-red-600"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
    </>
  );
}