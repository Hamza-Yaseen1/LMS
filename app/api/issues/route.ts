export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { memberId, bookId, dueAt } = await req.json();
  if (!memberId || !bookId) {
    return NextResponse.json({ error: 'memberId and bookId are required' }, { status: 400 });
  }

  const conn = await createConnection();
  try {
    await conn.beginTransaction();

    // Lock book row
    const [books] = await conn.query<any[]>(
      `SELECT copies_available FROM books WHERE id = ? FOR UPDATE`,
      [bookId]
    );
    if (!books[0]) {
      await conn.rollback();
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    if (books[0].copies_available <= 0) {
      await conn.rollback();
      return NextResponse.json({ error: 'No copies available' }, { status: 409 });
    }

    const [res]: any = await conn.query(
      `INSERT INTO issues (member_id, book_id, due_at)
       VALUES (?, ?, ?)`,
      [memberId, bookId, dueAt ?? null]
    );

    await conn.query(
      `UPDATE books SET copies_available = copies_available - 1 WHERE id = ?`,
      [bookId]
    );

    await conn.commit();
    return NextResponse.json({ id: res.insertId, memberId, bookId, dueAt }, { status: 201 });
  } catch (e) {
    await conn.rollback();
    throw e;
  }
}
