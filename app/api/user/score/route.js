import { NextResponse } from 'next/server';
import sql from '@/db/db';
import { auth0 } from '@/lib/auth0';

export async function POST() {
  const session = await auth0.getSession();

  if (!session?.user || typeof session.user !== 'object') {
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user;
  const userId = user.sub;

  if (!userId) {
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sql.query(
      'SELECT score FROM score_data WHERE user_id = $1',
      [userId]
    );

    if (result.length > 0) {
      const currentScore = result[0].score || 0;
      const newScore = currentScore + 1;

      await sql.query(
        'UPDATE score_data SET score = $1 WHERE user_id = $2',
        [newScore, userId]
      );
    } else {
      await sql.query(
        'INSERT INTO score_data (user_id, score) VALUES ($1, $2)',
        [userId, 1]
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Score incremented successfully',
    });
  } catch (err) {
    console.error('DB Error:', err.message);
    return NextResponse.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
