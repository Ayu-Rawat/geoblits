import { NextResponse } from 'next/server';
import sql from '@/db/db';
import cloudinary from '@/lib/cloudinary';

export async function POST(req) {
  const body = await req.json();
  const { user } = body;

  if (!user?.sub || !user.picture) {
    return NextResponse.json({
      statusCode: 400,
      message: 'User data is missing or invalid',
    }, { status: 400 });
  }

  // Check if user already exists
  const checkQuery = 'SELECT 1 FROM users WHERE user_id = $1 LIMIT 1';
  const checkResult = await sql.query(checkQuery, [user.sub]);

  if (checkResult.length > 0) {
    return NextResponse.json({
      statusCode: 200,
      message: 'User already exists — skipping update',
    });
  }

  // Upload to Cloudinary
  let uploadedImage;
  try {
    uploadedImage = await cloudinary.uploader.upload(user.picture, {
      folder: 'quiz-app-users',
      public_id: user.sub,
      overwrite: true,
    });
  } catch (err) {
    return NextResponse.json({
      statusCode: 500,
      message: 'Image upload failed',
      error: err.message,
    }, { status: 500 });
  }

  const imageUrl = uploadedImage.secure_url;

  // Insert new user
  const insertQuery = `
    INSERT INTO users (user_id, nickname, email, image_url)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [user.sub, user.nickname, user.name, imageUrl];
  await sql.query(insertQuery, values);

  return NextResponse.json({
    statusCode: 200,
    message: 'New user added successfully',
  });
}
