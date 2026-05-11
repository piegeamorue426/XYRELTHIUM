import React from 'react';
import Link from 'next/link';
import { Shield, Mail } from 'lucide-react';

const navigationLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Boutique', href: '/shop' },
  { label: 'Mon compte', href: '/account' },
];

const categoryLinks = [
  { label: 'Tech', href: '/categories/tech' },
  { label: 'Gaming', href: '/categories/gaming' },
  { label: 'Electromenager', href: '/categories/electromenager' },
  { label: 'Digital', href: '/categories/digital' },
];

const legalLinks = [
  { label: 'Conditions generales de vente', href: '/legal/cgv' },
  { label: 'Mentions legales', href: '/legal/mentions' },
  { label: 'Politique de confidentialite', href: '/legal/privacy' },
  { label: 'Contacter le support', href: '/support' },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <span className="font-space-grotesk text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Xyrelthium
            </span>
            <p className="text-sm text-white/50 leading-relaxed">
              Votre destination pour les produits tech, gaming et lifestyle
              a prix accessibles. Qualite et satisfaction garanties.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Informations
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-white/50 mb-2">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                />
                <button className="p-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors">
                  <Mail className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Xyrelthium. Tous droits reserves.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Paiement securise par Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
