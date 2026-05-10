import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Non authentifie', status: 401 };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Acces refuse', status: 403 };
  }

  return { user };
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'Aucun fichier envoye' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Type de fichier non supporte. Utilisez PNG, JPG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'Fichier trop volumineux. Maximum 5 Mo.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const adminClient = createAdminClient();
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await adminClient.storage
      .from('products')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      return NextResponse.json({ message: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage
      .from('products')
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Erreur lors de l\'envoi du fichier' }, { status: 500 });
  }
}
