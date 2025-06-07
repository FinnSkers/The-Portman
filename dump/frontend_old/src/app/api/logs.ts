import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Forward log to backend
    const backendRes = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const backendData = await backendRes.json();
    return NextResponse.json(backendData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to forward log', details: error?.toString() }, { status: 500 });
  }
}

export async function GET() {
  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/logs`);
    const backendData = await backendRes.json();
    return NextResponse.json(backendData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs', details: error?.toString() }, { status: 500 });
  }
}
