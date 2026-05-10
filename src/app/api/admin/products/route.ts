import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');

  const adminClient = createAdminClient();
  let query = adminClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { title, slug, short_description, description, price, compare_at_price, category, stock, status, is_digital, specs, images } = body;

    if (!title || !slug || !price || !category) {
      return NextResponse.json(
        { message: 'Champs requis manquants: titre, slug, prix, categorie' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('products')
      .insert({
        title,
        slug,
        short_description: short_description || '',
        description: description || '',
        price,
        compare_at_price: compare_at_price || null,
        category,
        stock: stock || 0,
        status: status || 'available',
        is_digital: is_digital || false,
        specs: specs || {},
        images: images || [],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Donnees invalides' }, { status: 400 });
  }
}
