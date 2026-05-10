import React from 'react';
import Link from 'next/link';
import { Cpu, Gamepad2, Zap, Monitor, Shield, Truck, Headphones, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';

const categories = [
  { name: 'Tech', slug: 'tech', icon: Cpu, description: 'Smartphones, accessoires, gadgets' },
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2, description: 'Consoles, jeux, peripheriques' },
  { name: 'Electromenager', slug: 'electromenager', icon: Zap, description: 'Maison connectee, petit electro' },
  { name: 'Digital', slug: 'digital', icon: Monitor, description: 'Logiciels, licences, formations' },
];

const trustItems = [
  { icon: Shield, label: 'Paiement securise', description: 'Transactions protegees par Stripe' },
  { icon: Truck, label: 'Livraison rapide', description: 'Expedition sous 24-48h' },
  { icon: Headphones, label: 'Support reactif', description: 'Reponse sous 24h maximum' },
  { icon: CheckCircle, label: 'Produits verifies', description: 'Selection rigoureuse garantie' },
];

export default async function HomePage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[#0a0a0f]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Produits tech & lifestyle{' '}
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  a prix accessibles
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                Decouvrez notre selection de produits tech, gaming et lifestyle.
                Qualite premium, prix mini, livraison rapide.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/shop">
                  <Button size="lg">
                    Decouvrir la boutique
                  </Button>
                </Link>
                <Link href="/categories/tech">
                  <Button variant="outline" size="lg">
                    Voir les categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Produits populaires
            </h2>
            <Link
              href="/shop"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Voir tout
            </Link>
          </div>
          <ProductGrid products={products || []} />
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Nos categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group p-6 bg-[#111118] border border-white/5 rounded-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)]"
                >
                  <Icon className="h-8 w-8 text-violet-400 mb-3 group-hover:text-violet-300 transition-colors" />
                  <h3 className="text-base font-semibold text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/50">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trust Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#111118]/50 border border-white/5"
                >
                  <div className="p-2 rounded-lg bg-violet-600/10">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      {item.label}
                    </h4>
                    <p className="text-xs text-white/40 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
