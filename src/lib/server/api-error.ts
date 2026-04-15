import { NextResponse } from 'next/server';

export function apiError(status: number, detail: string): NextResponse {
  return NextResponse.json({ status, detail }, { status });
}
