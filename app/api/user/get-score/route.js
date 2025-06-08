import { NextResponse } from "next/server";
import sql from "@/db/db"; 

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = body?.userId;

    if (!userId) {
      return NextResponse.json(
        { statusCode: 400, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await sql.query(
      "SELECT score FROM score_data WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { statusCode: 404, message: "User score not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: "User score fetched successfully",
      score: result[0].score,
    });
  } catch (error) {
    console.error("Error fetching user score:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
