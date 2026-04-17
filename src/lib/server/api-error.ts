import { NextResponse } from 'next/server';

export const apiError = (status: number, detail: string): NextResponse => {
  return NextResponse.json({ status, detail }, { status });
};
