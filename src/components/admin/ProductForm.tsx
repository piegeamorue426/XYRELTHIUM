'use client';

import React, { useState, useEffect } from 'react';
import { cn, generateSlug } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/types/database';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export interface ProductFormData {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  stock: number;
  status: 'available' | 'sold';
  is_digital: boolean;
  specs: Record<string, string>;
  images: string[];
}

const categories = ['Tech', 'Gaming', 'Electromenager', 'Digital'];

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManual, setSlugManual] = useState(false);
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData ? (initialData.price / 100).toString() : '');
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compare_at_price ? (initialData.compare_at_price / 100).toString() : ''
  );
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [stock, setStock] = useState(initialData?.stock?.toString() || '0');
  const [status, setStatus] = useState<'available' | 'sold'>(initialData?.status || 'available');
  const [isDigital, setIsDigital] = useState(initialData?.is_digital || false);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specs
      ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis';
    if (!slug.trim()) newErrors.slug = 'Le slug est requis';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Le prix doit etre superieur a 0';
    if (!category) newErrors.category = 'La categorie est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      short_description: shortDescription.trim(),
      description: description.trim(),
      price: Math.round(parseFloat(price) * 100),
      compare_at_price: compareAtPrice ? Math.round(parseFloat(compareAtPrice) * 100) : null,
      category,
      stock: parseInt(stock) || 0,
      status,
      is_digital: isDigital,
      specs: specsObj,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Informations generales</h3>

        <Input
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom du produit"
          error={errors.title}
        />

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManual(true);
          }}
          placeholder="url-du-produit"
          error={errors.slug}
        />

        <Input
          label="Description courte"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Une phrase de description"
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Description complete
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description detaillee du produit..."
            rows={5}
            className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:border-violet-500/50 focus:shadow-[0_0_10px_rgba(139,92,246,0.15)] resize-y"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Tarification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prix (EUR)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="29.99"
            error={errors.price}
          />

          <Input
            label="Ancien prix (EUR, optionnel)"
            type="number"
            step="0.01"
            min="0"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            placeholder="49.99"
          />
        </div>
      </div>

      {/* Category & Stock */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Inventaire</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Categorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white transition-all duration-200 focus:outline-none focus:border-violet-500/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-400">{errors.category}</p>
            )}
          </div>

          <Input
            label="Stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'available' | 'sold')}
              className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white transition-all duration-200 focus:outline-none focus:border-violet-500/50"
            >
              <option value="available">Disponible</option>
              <option value="sold">Epuise</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDigital}
              onChange={(e) => setIsDigital(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
          <span className="text-sm text-white/70">Produit digital</span>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Caracteristiques techniques</h3>
          <Button type="button" variant="ghost" size="sm" onClick={addSpec} icon={<Plus className="h-4 w-4" />}>
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder="Cle (ex: Processeur)"
                value={spec.key}
                onChange={(e) => updateSpec(index, 'key', e.target.value)}
              />
              <Input
                placeholder="Valeur (ex: Intel i9)"
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="shrink-0 p-2 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-white/5 bg-[#111118] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
        <ImageUploader existingImages={images} onChange={setImages} />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={isLoading}>
          {initialData ? 'Mettre a jour' : 'Creer le produit'}
        </Button>
      </div>
    </form>
  );
}
