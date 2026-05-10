'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm';
import type { Product } from '@/types/database';

export default function AdminEditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        router.push('/admin/products');
      }
    } catch {
      router.push('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const error = await res.json();
        alert(error.message || 'Erreur lors de la mise a jour du produit');
      }
    } catch {
      alert('Erreur lors de la mise a jour du produit');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-8 w-48 rounded bg-[#111118] animate-pulse" />
        <div className="h-96 rounded-xl bg-[#111118] animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">Produit introuvable</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Modifier le produit</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
