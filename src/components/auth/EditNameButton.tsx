'use client';

import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function EditNameButton({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name === currentName) { setEditing(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id);
    }
    setLoading(false);
    setEditing(false);
    window.location.reload();
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-white">{currentName || 'Utilisateur'}</h2>
        <button onClick={() => setEditing(true)} className="p-1 text-white/30 hover:text-violet-400 transition-colors" aria-label="Modifier le pseudo">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        className="px-2 py-1 bg-white/5 border border-violet-500/50 rounded-lg text-sm text-white focus:outline-none w-40"
        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
      />
      <button onClick={handleSave} disabled={loading} className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors">
        <Check className="h-4 w-4" />
      </button>
      <button onClick={() => { setEditing(false); setName(currentName); }} className="p-1 text-white/40 hover:text-white transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
