import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/admin';

export async function GET() {
  const auth = await verifyAdmin();
  if ('error' in auth) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const adminClient = createAdminClient();

  // Total revenue from paid orders
  const { data: orders } = await adminClient
    .from('orders')
    .select('total, status');

  const paidOrders = orders?.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered') || [];
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders?.length || 0;

  // Product counts
  const { count: totalProducts } = await adminClient
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: availableProducts } = await adminClient
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available');

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalProducts: totalProducts || 0,
    availableProducts: availableProducts || 0,
  });
}
