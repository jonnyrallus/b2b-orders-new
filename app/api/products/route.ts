import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../../lib/supabase';

export async function GET() {
  const supa = getServerSupabase();
  const { data, error } = await supa
    .from('products')
    .select('id, sku, name, unit, stock_qty, product_prices(price, price_tier_code)')
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data || []).map((p: any) => {
    const find = (t: string) => (p.product_prices || []).find((r: any) => r.price_tier_code === t)?.price ?? null;
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      unit: p.unit,
      stock_qty: p.stock_qty,
      priceA: find('A'),
      priceB: find('B'),
      priceC: find('C'),
    };
  });
  return NextResponse.json(rows);
}

