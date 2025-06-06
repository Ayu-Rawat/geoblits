import { NextResponse } from 'next/server';
import sql from '@/db/db'; // Adjust the import path as necessary

export async function POST(req) {
  const body = await req.json(); // 👈 Parse the body
  const { user } = body;

  if (!user?.sub) {
    return NextResponse.json({ statusCode: 400, message: 'User data is missing or invalid' }, { status: 400 });
  }

  const query = `
    INSERT INTO users (user_id, nickname, email, image_url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO UPDATE 
    SET email = EXCLUDED.email,
        image_url = EXCLUDED.image_url
  `;
  const values = [user.sub, user.nickname, user.name, user.picture];
  await sql.query(query, values);

  return NextResponse.json({ statusCode: 200, data: 'OK', message: 'User stored/updated successfully' });
}
