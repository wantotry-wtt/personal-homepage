import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const data = await readData();
  const results = [];

  // Search in cards
  for (const card of data.cards) {
    if (
      card.title.toLowerCase().includes(query) ||
      (card.description && card.description.toLowerCase().includes(query))
    ) {
      results.push({
        id: card.id,
        type: card.type,
        title: card.title,
        description: card.description,
        link: card.link,
      });
    }
  }

  return NextResponse.json({ results });
}
