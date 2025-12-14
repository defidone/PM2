import { NextRequest, NextResponse } from 'next/server';
import { importCsv, CsvRow } from '../../../lib/csv';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = (body.rows || []) as CsvRow[];
  const result = importCsv(rows);
  const status = result.errors.length ? 400 : 200;
  return NextResponse.json(result, { status });
}
