'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/api';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  placeholder = "https://example.com/image.jpg",
  helperText 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const response = await uploadImage(file);
      
      if (response.success && response.data?.url) {
        onChange(response.data.url);
      } else {
        setUploadError(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-label-bold text-on-surface-variant">{label}</label>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder={placeholder}
          />
        </div>
        <div className="relative">
          <input
            type="file"
            id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-label-bold cursor-pointer hover:bg-slate-200 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined text-sm">
              {isUploading ? 'sync' : 'upload'}
            </span>
            {isUploading ? 'UPLOADING...' : 'UPLOAD'}
          </label>
        </div>
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      {uploadError && <p className="text-xs text-red-500 font-bold">{uploadError}</p>}
      {value && (
        <div className="mt-4 relative w-full aspect-video sm:w-48 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
