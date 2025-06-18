import { NextResponse } from "next/server";
import sql from "@/db/db"; 
import { auth0 } from "@/lib/auth0";

export async function POST(request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user || typeof session.user !== 'object') {
      return NextResponse.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user;
    if (!user.sub) {
      return NextResponse.json(
        { statusCode: 400, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const userId = user.sub;

    if (!userId) {
      return NextResponse.json(
        { statusCode: 400, message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { game_no } = body;

    const result = await sql.query(
      "SELECT score FROM score_data WHERE user_id = $1 and game_no = $2",
      [userId, game_no]
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
