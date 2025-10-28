export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

type Ctx = { params: { id: string } };

export async function POST(_: NextRequest, { params }: Ctx) {
  const id = Number(params.id);
  const conn = await createConnection();

  try {
    await conn.beginTransaction();

    // Lock the issue row
    const [issues] = await conn.query<any[]>(
      `SELECT book_id, returned_at
         FROM issues
        WHERE id = ?
        FOR UPDATE`,
      [id]
    );
    const issue = (issues as any[])[0];
    if (!issue) {
      await conn.rollback();
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (issue.returned_at) {
      await conn.rollback();
      return NextResponse.json({ error: 'Already returned' }, { status: 409 });
    }

    await conn.query(`UPDATE issues SET returned_at = NOW() WHERE id = ?`, [id]);
    await conn.query(
      `UPDATE books SET copies_available = copies_available + 1 WHERE id = ?`,
      [issue.book_id]
    );

    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    throw e;
  }
}
