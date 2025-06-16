import { NextResponse } from 'next/server';
import sql from '@/db/db';
import { auth0 } from '@/lib/auth0';

export async function POST(req) {
  try {
    const body = await req.json();
    const { is_correct } = body;

    const session = await auth0.getSession();
    if (!session?.user || typeof session.user !== 'object') {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user;
    if (!user.sub) {
      return NextResponse.json(
        { statusCode: 400, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const userId = user.sub;

    if (!userId) {
      return NextResponse.json(
        { statusCode: 400, message: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await sql.query(`SELECT user_id FROM track_score WHERE user_id = $1`, [userId]);

    if (result.length === 0) {
      const initialScore = is_correct ? 1 : 0;
      await sql.query(
        `INSERT INTO track_score (user_id, score) VALUES ($1, $2)`,
        [userId, initialScore]
      );
    } else {
      let queryUpdate;
      if (is_correct === true) {
         queryUpdate = `UPDATE track_score SET score = score + 1 WHERE user_id = $1`
      }else{
        queryUpdate = `UPDATE track_score SET score = 0 WHERE user_id = $1`;
    } 

      await sql.query(queryUpdate, [userId]);

    }

    return NextResponse.json({ message: 'Score updated' }, { status: 200 });

  } catch (error) {
    console.error('Error in /track-score:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
