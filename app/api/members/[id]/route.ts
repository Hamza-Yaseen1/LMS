// app/api/members/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createConnection } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;            // ✅ unwrap Promise
  const memberId = Number.parseInt(id, 10);   // ✅ parse & validate

  if (!Number.isFinite(memberId) || memberId < 1) {
    return NextResponse.json({ error: 'Invalid member id' }, { status: 400 });
  }

  const conn = await createConnection();
  const [rows] = await conn.query(
    `SELECT id,
            full_name  AS fullName,
            email,
            phone,
            address,
            department,
            semester,
            created_at AS createdAt
       FROM members
      WHERE id = ?`,
    [memberId]
  );

  const result = (rows as any[])[0];
  if (!result) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  return NextResponse.json(result);
}
