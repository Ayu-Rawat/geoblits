import { NextResponse } from "next/server";
import sql from "@/db/db.js";
import { auth0 } from "@/lib/auth0.js";

export async function GET() {
    try {
        const session = await auth0.getSession();
        if (!session?.user || typeof session.user !== 'object') {
            return NextResponse.json({ statusCode: 401, message: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;

        if (!user.sub) {
            return NextResponse.json({ statusCode: 400, message: "Invalid user ID" }, { status: 400 });
        }

        const userId = user.sub;

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