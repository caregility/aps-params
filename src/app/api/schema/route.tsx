import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'schema.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Schema file not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ message: 'Schema saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save schema' }, { status: 500 });
  }
}
