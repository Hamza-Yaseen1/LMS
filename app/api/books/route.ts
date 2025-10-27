import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM book";
    const [book] = await db.query(sql);
    return NextResponse.json( book);
  } catch (error) {
      console.log(error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  
}
}

