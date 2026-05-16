import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Simple check to ensure only admin can update data
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '') || getCookie(request, 'admin_token');

  if (!token || !(await verifyAuth(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newData = await request.json();
    const success = await writeData(newData);
    
    if (success) {
      return NextResponse.json({ message: 'Data updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  }
}

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) return match[2];
  return null;
}
