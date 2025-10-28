// app/api/members/[id]/history/route.ts
import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const memberId = Number.parseInt(id, 10);
  if (!Number.isFinite(memberId)) {
    return NextResponse.json({ error: 'Invalid member id' }, { status: 400 });
  }

  const conn = await createConnection();
  const [rows] = await conn.query(
    `SELECT i.id,
            i.issued_at   AS issuedAt,
            i.due_at      AS dueAt,
            i.returned_at AS returnedAt,
            b.id          AS bookId,
            b.title,
            b.author
       FROM issues i
       JOIN books b ON b.id = i.book_id
      WHERE i.member_id = ?
      ORDER BY i.issued_at DESC`,
    [memberId]
  );

  const data = (rows as any[]).map((r) => ({
    id: r.id,
    issuedAt: r.issuedAt,
    dueAt: r.dueAt,
    returnedAt: r.returnedAt,
    book: { id: r.bookId, title: r.title, author: r.author },
  }));

  return NextResponse.json(data);
}
