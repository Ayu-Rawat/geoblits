import { NextResponse } from 'next/server';
import sql from '@/db/db';
import { auth0 } from '@/lib/auth0';
import { decryptData } from '@/utils/encryption'; // Include only if you want to try decrypting

const scoreTimestampsMap = new Map();
const MAX_REQUESTS = 5;
const TIME_WINDOW_MS = 10000;

export async function POST(req) {
  const session = await auth0.getSession();

  if (!session?.user || typeof session.user !== 'object') {
    console.log('[AUTH ERROR] No valid session.');
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.sub;
  if (!userId) {
    console.log('[AUTH ERROR] No user ID in session.');
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const timestamps = scoreTimestampsMap.get(userId) || [];
  const recentTimestamps = timestamps.filter(ts => now - ts < TIME_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    console.log('[RATE LIMIT] Too many attempts:', recentTimestamps);
    return NextResponse.json(
      { statusCode: 429, message: 'Too many score attempts. Please slow down.' },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { selected_option } = body;

  if (!selected_option) {
    console.log('[BODY ERROR] Missing selected_option');
    return NextResponse.json(
      { statusCode: 400, message: 'Missing selected option' },
      { status: 400 }
    );
  }

  try {
    const trackResult = await sql.query(
      'SELECT question FROM track_answer WHERE user_id = $1',
      [userId]
    );

    if (trackResult.length === 0) {
      console.log('[TRACK ERROR] No tracked question found for user:', userId);
      return NextResponse.json(
        { statusCode: 400, message: 'No question being tracked for this user' },
        { status: 400 }
      );
    }

    const correctOption = trackResult[0].question;

    // Debug logs — encrypted
    console.log(`[DEBUG] Encrypted selected_option: ${selected_option}`);
    console.log(`[DEBUG] Encrypted correct_option:  ${correctOption}`);

    // Optional: Try decrypting both for debugging
    try {
      const decryptedSelected = decryptData(selected_option);
      const decryptedCorrect = decryptData(correctOption);
      console.log(`[DEBUG] Decrypted selected_option: ${decryptedSelected}`);
      console.log(`[DEBUG] Decrypted correct_option:  ${decryptedCorrect}`);
    } catch (err) {
      console.log('[DEBUG] Decryption failed or not needed:', err.message);
    }

    const decryptedSelected = decryptData(selected_option);
    const decryptedCorrect = decryptData(correctOption);
    const isCorrect = decryptedSelected === decryptedCorrect;

    if (isCorrect) {
      recentTimestamps.push(now);
      scoreTimestampsMap.set(userId, recentTimestamps);

      const scoreResult = await sql.query(
        'SELECT score FROM score_data WHERE user_id = $1',
        [userId]
      );

      if (scoreResult.length > 0) {
        const newScore = (scoreResult[0].score || 0) + 1;
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

      console.log('[SCORE] Correct answer submitted. Score updated.');
      return NextResponse.json({
        statusCode: 200,
        message: 'Correct! Score updated.',
        correct: true
      });
    } else {
      console.log('[SCORE] Incorrect answer.');
      return NextResponse.json({
        statusCode: 200,
        message: 'Incorrect answer.',
        correct: false
      });
    }
  } catch (err) {
    console.error('[SERVER ERROR]', err.message);
    return NextResponse.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
