import { NextResponse } from 'next/server';
import sql from '@/db/db';
import cloudinary from '@/lib/cloudinary';
import crypto from 'crypto';
import { auth0 } from '@/lib/auth0';

// Secret salt from environment
const SALT = process.env.HASH_SALT || 'your-secret-salt';

// Secure SHA-256 hash with salt
function hashWithSalt(sub){
  return crypto.createHash('sha256').update(SALT + sub).digest('hex').slice(0, 32);
}

export async function PATCH(req) {
  const session = await auth0.getSession();
  if (!session?.user || typeof session.user !== 'object') {
    return NextResponse.json(
      { statusCode: 401, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = session.user;
  const userId = user.sub;
  if (!userId) {
    return NextResponse.json(
      { statusCode: 400, message: 'Invalid user ID' },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { nickname, imageUrl } = body;

  // Create a secure hashed ID for Cloudinary
  const hashedId = hashWithSalt(userId);
  let finalImageUrl = imageUrl;

  if (imageUrl && !imageUrl.includes('res.cloudinary.com')) {
    try {
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: 'quiz-app-users',
        public_id: hashedId,
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

  values.push(userId); // Still use original userId for DB lookup

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
