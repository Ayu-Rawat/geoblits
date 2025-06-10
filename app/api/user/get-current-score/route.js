import { NextResponse } from "next/server";
import sql from "@/db/db.js";

export async function POST(request) {
    try {
        const body = await request.json();
        const userId = body?.userId;

        if (!userId) {
            return NextResponse.json({ statusCode: 400, message: "User ID is required" }, { status: 400 });
        }

        const scoreData = await sql.query("SELECT score FROM track_score WHERE user_id = $1", [userId]);

        if (scoreData.length === 0) {
            return NextResponse.json({ statusCode: 404, message: "Score not found for this user" }, { status: 404 });
        }

        return NextResponse.json({ statusCode: 200, score: scoreData[0].score }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user score:", error);
        return NextResponse.json({ statusCode: 500, message: "Internal Server Error" }, { status: 500 });
    }
}