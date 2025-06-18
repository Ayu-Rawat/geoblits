import { NextResponse } from 'next/server';
import sql from '@/db/db';
import { auth0 } from '@/lib/auth0';

export async function POST(req) {
  try {
    const body = await req.json();
    const { current_question,game_no } = body;

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

    if (!userId || current_question === undefined) {
      return NextResponse.json(
        { statusCode: 400, message: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const query = `SELECT user_id FROM track_answer WHERE user_id = $1 and game_no = $2`;
    const result = await sql.query(query, [userId, game_no]);

    if (result.length === 0) {
      const queryInsert = `
        INSERT INTO track_answer (question, user_id, game_no)
        VALUES ($1, $2, $3)
      `;
      await sql.query(queryInsert, [current_question, userId, game_no]);
    } else {
      const queryUpdate = `
        UPDATE track_answer
        SET question = $1
        WHERE user_id = $2
        and game_no = $3
      `;
      await sql.query(queryUpdate, [current_question, userId, game_no]);
    }

    return NextResponse.json({ message: 'Answer tracked' }, { status: 200 });
  } catch (error) {
    console.error("Error tracking answer:", error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
