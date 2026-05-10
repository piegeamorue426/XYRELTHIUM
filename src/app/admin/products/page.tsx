'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Supprimer ce produit ? Cette action est irreversible.')) return;

    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          Disponible
        </span>
      );
    }
    return (
      <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400">
        Epuise
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Produits</h1>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-[#111118] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <Link href="/admin/products/new">
          <Button icon={<Plus className="h-4 w-4" />}>Ajouter un produit</Button>
        </Link>
      </div>

      {/* Search */}
      <Input
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#111118] p-12 text-center">
          <p className="text-white/40">
            {search ? 'Aucun produit ne correspond a votre recherche' : 'Aucun produit pour le moment'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#111118]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Titre</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Categorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                >
                  <td className="px-4 py-3">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-white/5" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{product.title}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{product.stock}</td>
                  <td className="px-4 py-3 text-sm text-white/70">{product.category}</td>
                  <td className="px-4 py-3">{statusBadge(product.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/products/${product.id}/edit`);
                        }}
                        className="rounded-md p-1.5 text-white/40 hover:text-violet-400 hover:bg-violet-400/10 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(product.id, e)}
                        disabled={deleting === product.id}
                        className="rounded-md p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
