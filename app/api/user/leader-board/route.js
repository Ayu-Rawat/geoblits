// app/api/leaderboard/route.js
import { NextResponse } from 'next/server';
import sql from '@/db/db';

export async function GET() {
  const query = `
    SELECT 
      u.nickname, 
      u.image_url, 
      s.score
    FROM score_data s
    JOIN users u ON s.user_id = u.user_id
    ORDER BY s.score DESC
    LIMIT 10;
  `;
  const result = await sql.query(query);

  return NextResponse.json({ statusCode: 200, data: result, message: 'OK' });
}
