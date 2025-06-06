import { NextResponse } from 'next/server';
import sql from '@/db/db';

export async function POST(req) {
  const body = await req.json();
  const user = body?.user;

  if (!user?.sub) {
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  const score = body?.score;

  if (typeof score !== 'number') {
    return NextResponse.json({ statusCode: 400, message: 'Score must be a number' }, { status: 400 });
  }

  const userId = user.sub;
  const check = await sql.query('SELECT * FROM score_data WHERE user_id = $1', [userId]);

  if (check.length > 0) {
    await sql.query('UPDATE score_data SET score = $1 WHERE user_id = $2', [score, userId]);
  } else {
    await sql.query('INSERT INTO score_data (user_id, score) VALUES ($1, $2)', [userId, score]);
  }

  return NextResponse.json({ statusCode: 200, message: 'Score updated successfully' });
}
