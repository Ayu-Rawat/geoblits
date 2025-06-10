import { NextResponse } from 'next/server';
import sql from '@/db/db';
import cloudinary from '@/lib/cloudinary';

export async function PATCH(req) {
  const body = await req.json();
  const { userId, nickname, imageUrl } = body;

  if (!userId) {
    return NextResponse.json(
      { statusCode: 400, message: 'User ID is required' },
      { status: 400 }
    );
  }

  let finalImageUrl = imageUrl;

  if (imageUrl && !imageUrl.includes('res.cloudinary.com')) {
    try {
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: 'quiz-app-users',
        public_id: nickname,
        overwrite: true,
      });
      finalImageUrl = uploadResult.secure_url;
    } catch (error) {
      return NextResponse.json(
        { statusCode: 500, message: 'Image upload failed', error: error.message },
        { status: 500 }
      );
    }
  }

  const fields = [];
  const values = [];
  let idx = 1;

  if (nickname) {
    fields.push(`nickname = $${idx++}`);
    values.push(nickname);
  }

  if (finalImageUrl) {
    fields.push(`image_url = $${idx++}`);
    values.push(finalImageUrl);
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { statusCode: 400, message: 'Nothing to update' },
      { status: 400 }
    );
  }

  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE user_id = $${idx}
  `;

  try {
    await sql.query(query, values);
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: 'Database update failed', error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    statusCode: 200,
    message: 'User updated successfully',
  });
}
