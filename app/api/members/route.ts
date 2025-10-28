export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function GET() {
  const conn = await createConnection();
  const [rows] = await conn.query(
    `SELECT id,
            full_name AS fullName,
            email,
            phone,
            address,
            created_at AS createdAt
       FROM members
      ORDER BY id DESC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { fullName, email, phone, address } = await req.json();

  if (!fullName) {
    return NextResponse.json({ error: 'fullName is required' }, { status: 400 });
  }

  const conn = await createConnection();
  const [result]: any = await conn.query(
    `INSERT INTO members (full_name, email, phone, address)
     VALUES (?, ?, ?, ?)`,
    [fullName, email ?? null, phone ?? null, address ?? null]
  );

  const [rows] = await conn.query(
    `SELECT id,
            full_name AS fullName,
            email,
            phone,
            address,
            created_at AS createdAt
       FROM members
      WHERE id = ?`,
    [result.insertId]
  );

  return NextResponse.json((rows as any[])[0], { status: 201 });
}
