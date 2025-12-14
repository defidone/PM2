import { NextRequest, NextResponse } from 'next/server';
import { exportCardsToCsv, CsvRow, importCsv } from '../../../lib/csv';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = (body.rows || []) as CsvRow[];
  const { cards, errors } = importCsv(rows);
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }
  const csv = exportCardsToCsv(cards);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv'
    }
  });
}
