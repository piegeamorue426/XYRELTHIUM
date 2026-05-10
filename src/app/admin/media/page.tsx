'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  name: string;
  url: string;
  size?: number;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    // Fetch from Supabase storage
    const { data: files } = await supabase.storage.from('products').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (files) {
      const items: MediaItem[] = files
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const { data: urlData } = supabase.storage.from('products').getPublicUrl(f.name);
          return {
            name: f.name,
            url: urlData.publicUrl,
            size: f.metadata?.size,
          };
        });
      setMedia(items);
    }
    setLoading(false);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const formData = new FormData();
      formData.append('file', file);

      try {
        await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    await fetchMedia();
    setUploading(false);
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    await supabase.storage.from('products').remove([name]);
    setMedia(media.filter((m) => m.name !== name));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Media</h1>

      {/* Upload Zone */}
      <div
        className={cn(
          'rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
          dragActive
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-white/10 hover:border-white/20 bg-[#111118]'
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
          <Upload className={cn('h-10 w-10', dragActive ? 'text-violet-400' : 'text-white/30')} />
          <p className="text-sm text-white/50">
            {uploading ? 'Envoi en cours...' : 'Glissez vos images ici ou cliquez pour selectionner'}
          </p>
          <p className="text-xs text-white/30">PNG, JPG, WebP - Max 5 Mo par fichier</p>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-[#111118] animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <p className="text-white/40">Aucun media pour le moment</p>
          <p className="text-sm text-white/30 mt-1">Commencez par importer des images</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.name}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#111118]"
            >
              <img
                src={item.url}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-xs text-white/70 truncate w-full text-center">{item.name}</p>
                <p className="text-xs text-white/40">{formatFileSize(item.size)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="rounded-md bg-white/10 p-2 hover:bg-violet-500/20 transition-colors"
                    title="Copier l'URL"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.name)}
                    className="rounded-md bg-white/10 p-2 hover:bg-red-500/20 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
