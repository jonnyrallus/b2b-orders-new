import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../lib/supabase';

export async function GET() {
  const supa = getServerSupabase();
  const { data, error } = await supa
    .from('orders')
    .select('id, created_at, notes, status, customers(name)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { customerId, notes, lines } = body || {};
  if (!customerId || !Array.isArray(lines) || !lines.length) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const supa = getServerSupabase();
  const { data: order, error } = await supa
    .from('orders')
    .insert({ customer_id: customerId, notes, status: 'submitted' })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orderId = order.id;
  const insertLines = lines.map((l: any) => ({
    order_id: orderId,
    product_id: l.productId,
    qty: l.qty,
    unit_price: l.unitPrice,
  }));
  const { error: e2 } = await supa.from('order_lines').insert(insertLines);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  return NextResponse.json({ id: orderId });
}
