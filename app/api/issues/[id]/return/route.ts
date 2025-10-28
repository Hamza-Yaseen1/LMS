// app/api/issues/[id]/return/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

// In Next 16, params is a Promise
type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_: NextRequest, { params }: Ctx) {
  const { id } = await params;                 // <-- unwrap the promise
  const idNum = Number.parseInt(id, 10);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return NextResponse.json({ error: 'Invalid issue id' }, { status: 400 });
  }

  const conn = await createConnection();

  try {
    await conn.beginTransaction();

    // Lock the issue row to prevent double-returns
    const [issues] = await conn.query<any[]>(
      `SELECT id, book_id, returned_at
         FROM issues
        WHERE id = ?
        FOR UPDATE`,
      [idNum]
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

    // 1) Mark as returned
    await conn.query(`UPDATE issues SET returned_at = NOW() WHERE id = ?`, [idNum]);

    // 2) Increment available copies but never exceed total copies
    await conn.query(
      `UPDATE books
          SET copies_available = LEAST(copies_total, copies_available + 1)
        WHERE id = ?`,
      [issue.book_id]
    );

    // 3) Fetch the timestamp we just set to return to the client
    const [after] = await conn.query<any[]>(
      `SELECT returned_at FROM issues WHERE id = ?`,
      [idNum]
    );
    const returnedAt: string | null = (after as any[])[0]?.returned_at ?? null;

    await conn.commit();
    return NextResponse.json({ returnedAt });
  } catch (e: any) {
    try { await conn.rollback(); } catch {}
    const msg = e?.message ?? 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    try {
      // mysql2/promise pools expose release(); connections expose end()
      if ('release' in conn && typeof (conn as any).release === 'function') {
        (conn as any).release();
      } else if ('end' in conn && typeof (conn as any).end === 'function') {
        await (conn as any).end();
      }
    } catch {}
  }
}

// Optional: keep POST working for backward compatibility
export const POST = PATCH;
