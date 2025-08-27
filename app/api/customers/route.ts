import { NextResponse } from 'next/server';
import { getServerSupabase } from '../../../lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const supa = getServerSupabase();
  let query = supa.from('customers').select('*').order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supa = getServerSupabase();
  const body = await req.json();
  const { id, name, vat_number, city, price_tier } = body || {};
  if (!id || !name) return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
  const { error } = await supa.from('customers').insert({ id, name, vat_number, city, price_tier });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const supa = getServerSupabase();
  const body = await req.json();
  const { id, name, vat_number, city, price_tier } = body || {};
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supa.from('customers').update({ name, vat_number, city, price_tier }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
