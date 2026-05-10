'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  existingImages?: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ existingImages = [], onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setImages(newImages);
    onChange(newImages);
    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  }, [images]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
          dragActive
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-white/10 hover:border-white/20 bg-[#0d0d14]'
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className={cn('h-8 w-8', dragActive ? 'text-violet-400' : 'text-white/30')} />
          <p className="text-sm text-white/50">
            {uploading ? 'Envoi en cours...' : 'Glissez vos images ici ou cliquez pour selectionner'}
          </p>
          <p className="text-xs text-white/30">PNG, JPG, WebP (max 5 Mo)</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-[#0d0d14]"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 rounded-full bg-red-600/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <ImageIcon className="h-4 w-4" />
          <span>Aucune image ajoutee</span>
        </div>
      )}
    </div>
  );
}
