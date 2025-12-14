import { NextResponse } from 'next/server';

// Placeholder: would call OpenAI with authorized key per user.
export async function POST() {
  return NextResponse.json({
    message: 'Assistant actions will use provided API key and scoped board data.'
  });
}
