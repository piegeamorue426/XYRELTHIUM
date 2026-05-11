'use client';

import React, { useState } from 'react';
import { Send, MessageCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch {
      setError('Erreur de connexion');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Card padding="lg" className="max-w-md mx-auto text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Message envoye !</h1>
            <p className="text-sm text-white/50 mb-4">
              cesmax vous repondra dans les plus brefs delais.
            </p>
            <a href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Retour a l&apos;accueil
            </a>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <MessageCircle className="h-10 w-10 text-violet-400 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white mb-2">Contacter le support</h1>
            <p className="text-white/50">Un probleme ? Une question ? cesmax vous repond rapidement.</p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <Input
                label="Sujet"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de votre message"
              />
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Decrivez votre demande..."
                  rows={5}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} icon={<Send className="h-4 w-4" />}>
                Envoyer
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
