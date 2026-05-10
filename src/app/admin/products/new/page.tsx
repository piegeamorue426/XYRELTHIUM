'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm';

export default function AdminNewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const error = await res.json();
        alert(error.message || 'Erreur lors de la creation du produit');
      }
    } catch {
      alert('Erreur lors de la creation du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Nouveau produit</h1>
      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
