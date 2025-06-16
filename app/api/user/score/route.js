import { NextResponse } from 'next/server';
import sql from '@/db/db';
import { auth0 } from '@/lib/auth0';

const scoreTimestampsMap = new Map();
const MAX_REQUESTS = 5;
const TIME_WINDOW_MS = 10000;

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

  const now = Date.now();
  const timestamps = scoreTimestampsMap.get(userId) || [];

  const recentTimestamps = timestamps.filter(ts => now - ts < TIME_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return NextResponse.json(
      { statusCode: 429, message: 'Too many score attempts. Please slow down.' },
      { status: 429 }
    );
  }

  // Update timestamps
  recentTimestamps.push(now);
  scoreTimestampsMap.set(userId, recentTimestamps);

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
