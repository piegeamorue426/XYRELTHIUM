'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart/CartProvider';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Boutique', href: '/shop' },
  { label: 'Tech', href: '/categories/tech' },
  { label: 'Gaming', href: '/categories/gaming' },
  { label: 'Electromenager', href: '/categories/electromenager' },
  { label: 'Digital', href: '/categories/digital' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount, setCartOpen } = useCart();
  const itemCount = getItemCount();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-space-grotesk text-xl font-bold text-white hover:text-violet-400 transition-colors"
            >
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Xyrelthium
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Link
                href="/search"
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-white/70 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Favoris"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-violet-600 text-white rounded-full">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              <Link
                href="/account"
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Mon compte"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
