import { NextResponse } from 'next/server';
import sql from '@/db/db';
import cloudinary from '@/lib/cloudinary';
import crypto from 'crypto';
import { auth0 } from '@/lib/auth0';

const SALT = process.env.HASH_SALT || 'fallback-salt';

function hashWithSalt(sub) {
  return crypto.createHash('sha256').update(SALT + sub).digest('hex').slice(0, 32);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { picture } = body;

    if (!picture) {
      return NextResponse.json({
        statusCode: 400,
        message: 'Picture is required',
      }, { status: 400 });
    }

    const session = await auth0.getSession();
    if (!session?.user || typeof session.user !== 'object') {
      return NextResponse.json({
        statusCode: 401,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const user = session.user;

    if (!user.sub) {
      return NextResponse.json({
        statusCode: 400,
        message: 'Invalid user ID',
      }, { status: 400 });
    }

    // Check if user already exists
    const checkQuery = 'SELECT 1 FROM users WHERE user_id = $1 LIMIT 1';
    const checkResult = await sql.query(checkQuery, [user.sub]);

    if (checkResult?.length > 0) {
      return NextResponse.json({
        statusCode: 200,
        message: 'User already exists — skipping insert',
      });
    }

    const hashedId = hashWithSalt(user.sub);
    let imageUrl;

    try {
      const uploaded = await cloudinary.uploader.upload(picture, {
        folder: 'quiz-app-users',
        public_id: hashedId,
        overwrite: true,
      });
      imageUrl = uploaded.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);

      try {
        const fallbackRes = await fetch('https://api.thecatapi.com/v1/images/search');
        const fallbackData = await fallbackRes.json();
        const fallbackUrl = fallbackData[0]?.url || 'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg';

        const uploaded = await cloudinary.uploader.upload(fallbackUrl, {
          folder: 'quiz-app-users',
          public_id: hashedId,
          overwrite: true,
        });

        imageUrl = uploaded.secure_url;
      } catch (fallbackErr) {
        return NextResponse.json({
          statusCode: 500,
          message: 'Fallback image fetch/upload failed',
          error: fallbackErr.message,
        }, { status: 500 });
      }
    }

    // Normalize email and nickname
    let email = user.email || user.nickname || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      email = `${email}@gmail.com`;
    }

    let nickname = user.name || user.nickname || email.split('@')[0];

    const insertQuery = `
      INSERT INTO users (user_id, nickname, email, image_url)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [user.sub, nickname, email, imageUrl];
    await sql.query(insertQuery, values);

    return NextResponse.json({
      statusCode: 200,
      message: 'New user added successfully',
      imageUrl,
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({
      statusCode: 500,
      message: 'Internal server error',
      error: e.message,
    }, { status: 500 });
  }
}
