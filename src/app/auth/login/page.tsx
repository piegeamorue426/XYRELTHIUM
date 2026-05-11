'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Email ou mot de passe incorrect.');
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-space-grotesk text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
          >
            Xyrelthium
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">
            Se connecter
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Mot de passe oublie ?
              </Link>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Se connecter
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Pas encore de compte ?{' '}
            <Link
              href="/auth/signup"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Creer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
