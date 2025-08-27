import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../../lib/supabase';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supa = getServerSupabase();
  const id = Number(params.id);

  const { data: order, error } = await supa
    .from('orders')
    .select('id, created_at, notes, status, customer_id, customers(name, vat_number, city, price_tier)')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: lines, error: e2 } = await supa
    .from('order_lines')
    .select('product_id, qty, unit_price, products(name, sku, unit)')
    .eq('order_id', id);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ...order, lines });
}

