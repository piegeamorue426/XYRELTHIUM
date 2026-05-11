'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="relative w-full max-w-md text-center">
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-8">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Email envoye !</h2>
            <p className="text-sm text-white/50 mb-6">
              Si un compte existe avec <strong className="text-white">{email}</strong>, vous recevrez un lien pour reinitialiser votre mot de passe.
            </p>
            <Link href="/auth/login">
              <Button variant="outline" size="md">Retour a la connexion</Button>
            </Link>
          </div>
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
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white mb-4">
            <ArrowLeft className="h-3 w-3" /> Retour
          </Link>
          <h1 className="text-xl font-bold text-white mb-2">Mot de passe oublie</h1>
          <p className="text-sm text-white/50 mb-6">Entrez votre email et nous vous enverrons un lien de reinitialisation.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>
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
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Envoyer le lien
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
