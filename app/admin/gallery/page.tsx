'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getGalleryItems, addToGallery, deleteFromGallery, uploadImage } from '@/lib/api';
import { GridSkeleton } from '@/components/admin/Skeleton';

interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
  created_at: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadUrl, setShowUploadUrl] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState('Food');

  const loadGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getGalleryItems(activeFilter);
      if (response.success && response.data) {
        setItems((response.data as any).items || []);
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const uploadRes = await uploadImage(selectedFile);
      
      if (uploadRes.success && uploadRes.data?.url) {
        const response = await addToGallery({
          image_url: uploadRes.data.url,
          category: newCategory,
        });

        if (response.success) {
          setSelectedFile(null);
          setShowUploadFile(false);
          await loadGallery();
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    try {
      setIsUploading(true);
      const response = await addToGallery({
        image_url: newImageUrl,
        category: newCategory,
      });

      if (response.success) {
        setNewImageUrl('');
        setShowUploadUrl(false);
        await loadGallery();
      }
    } catch (err) {
      console.error('Error adding to gallery:', err);
      alert('Error adding image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await deleteFromGallery(id);
      if (response.success) {
        await loadGallery();
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const stats = {
    total: items.length,
    storage: (items.length * 0.5).toFixed(1) + ' MB', // Just a mock value
  };

  return (
    <>
      {/* Upload Section */}
          <section className="mb-8">
            {!showUploadUrl && !showUploadFile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setShowUploadFile(true)}
                  className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors text-3xl">
                    📁
                  </div>
                  <h3 className="font-headline-md text-on-surface mb-1">Upload from Laptop</h3>
                  <p className="font-body-md text-secondary mb-6">Select image files from your computer</p>
                  <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-bold flex items-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    SELECT FILE
                  </button>
                </div>
                <div 
                  onClick={() => setShowUploadUrl(true)}
                  className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors text-3xl">
                    🔗
                  </div>
                  <h3 className="font-headline-md text-on-surface mb-1">Add by URL</h3>
                  <p className="font-body-md text-secondary mb-6">Paste a direct link to an image</p>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-label-bold flex items-center gap-2 shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">link</span>
                    PASTE URL
                  </button>
                </div>
              </div>
            ) : showUploadFile ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-headline-sm text-on-surface mb-4">Upload Image from Computer</h3>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Image *</label>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Food">Food</option>
                        <option value="Interior">Interior</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isUploading || !selectedFile}
                      className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload & Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadFile(false)}
                      className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-label-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-headline-sm text-on-surface mb-4">Add Image by URL</h3>
                <form onSubmit={handleAddImageUrl} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Image URL *</label>
                      <input
                        type="url"
                        required
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Food">Food</option>
                        <option value="Interior">Interior</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isUploading ? 'Adding...' : 'Add Image'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadUrl(false)}
                      className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-label-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>


          {/* Filters & Statistics */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Food', 'Interior', 'Events'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-label-bold shadow-sm transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-on-primary'
                      : 'bg-white border border-slate-200 text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-6 text-secondary bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center border-r border-slate-200 pr-6">
                <span className="font-stat-value text-on-surface">{stats.total}</span>
                <span className="font-label-sm uppercase tracking-tighter">Total</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-stat-value text-on-surface">{stats.storage}</span>
                <span className="font-label-sm uppercase tracking-tighter">Mock Storage</span>
              </div>
            </div>
          </section>

          {/* Photo Grid */}
          <section className="pb-20">
            {isLoading ? (
              <GridSkeleton />
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl">
                <p className="text-on-surface-variant font-body-lg">No images found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="gallery-card relative group rounded-xl overflow-hidden aspect-square shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-100">
                    <Image
                      src={item.image_url}
                      alt={item.category}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="delete-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="w-12 h-12 bg-[#d4a843] text-[#1a1f2e] rounded-full flex items-center justify-center hover:brightness-95 active:scale-90 transition-all shadow-lg"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {item.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
      </section>
    </>
  );
}

