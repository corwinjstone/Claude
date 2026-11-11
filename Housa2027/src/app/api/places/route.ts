import { NextResponse } from 'next/server';
import { suggestAddresses } from '@/lib/places';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.slice(0, 120) ?? '';
  return NextResponse.json(await suggestAddresses(q));
}
