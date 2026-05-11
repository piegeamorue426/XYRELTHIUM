'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} variant="ghost" size="sm" icon={<LogOut className="h-4 w-4" />}>
      Se deconnecter
    </Button>
  );
}
