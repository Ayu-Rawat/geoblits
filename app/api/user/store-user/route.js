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

  const checkQuery = 'SELECT 1 FROM users WHERE user_id = $1 LIMIT 1';
  const checkResult = await sql.query(checkQuery, [user.sub]);

  if (checkResult.length > 0) {
    return NextResponse.json({
      statusCode: 200,
      message: 'User already exists — skipping update',
    });
  }

  let imageUrl;

  try {
    const uploadedImage = await cloudinary.uploader.upload(user.picture, {
      folder: 'quiz-app-users',
      public_id: user.sub,
      overwrite: true,
    });
    imageUrl = uploadedImage.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed, using fallback image.', err.message);
    
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await res.json();
      const random_imageUrl = data[0]?.url || 'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg';
      const uploadedImage = await cloudinary.uploader.upload(random_imageUrl, {
        folder: 'quiz-app-users',
        public_id: user.sub,
        overwrite: true,
      });
      imageUrl = uploadedImage.secure_url;
    } catch (fallbackErr) {
      return NextResponse.json({
        statusCode: 500,
        message: 'Both Cloudinary and fallback image fetch failed',
        error: fallbackErr.message,
      }, { status: 500 });
    }
  }

  let email = user.name || user.email;

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    email = email + '@gmail.com'; 
  }

  let nickname = user.name

  if(!nickname){
    nickname = user.email.split('@')[0]; 
  }

  const insertQuery = `
    INSERT INTO users (user_id, nickname, email, image_url)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [user.sub,nickname, email,  imageUrl];
  await sql.query(insertQuery, values);

  return NextResponse.json({
    statusCode: 200,
    message: 'New user added successfully',
    imageUrl,
  });
}
