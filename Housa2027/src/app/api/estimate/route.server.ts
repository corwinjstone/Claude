import { NextResponse } from 'next/server';
import { estimateFor } from '@/lib/estimate';
import { googlePlaceZip } from '@/lib/places';

// GET /api/estimate?id=<suggestion id>&label=<address text>&zip=<optional>
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const id = sp.get('id') ?? '';
  const label = (sp.get('label') ?? '').slice(0, 200);
  let zip = sp.get('zip');
  if (!label && !id) return NextResponse.json({ error: 'Enter an address.' }, { status: 400 });
  if (id.startsWith('google:') && !zip) zip = await googlePlaceZip(id.slice(7));
  const propertyId = id.startsWith('housa:') ? id.slice(6) : undefined;
  return NextResponse.json(estimateFor({ propertyId, label, zip }));
}
