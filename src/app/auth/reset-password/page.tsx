'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Minimum 6 caracteres'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/account'), 2000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-8 text-center max-w-md">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Mot de passe modifie !</h2>
          <p className="text-sm text-white/50">Redirection vers votre compte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px]" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-space-grotesk text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Xyrelthium
          </Link>
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-sm text-white/50 mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Nouveau mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 caracteres"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
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
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Changer le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
