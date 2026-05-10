import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Produit introuvable' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { title, slug, short_description, description, price, compare_at_price, category, stock, status, is_digital, specs, images } = body;

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('products')
      .update({
        title,
        slug,
        short_description,
        description,
        price,
        compare_at_price: compare_at_price || null,
        category,
        stock,
        status,
        is_digital,
        specs: specs || {},
        images: images || [],
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: 'Produit introuvable' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Donnees invalides' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('products')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Produit supprime' });
}
