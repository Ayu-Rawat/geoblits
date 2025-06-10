import { NextResponse } from "next/server";
import sql from "@/db/db.js";

export async function POST(request) {
    try {
        const body = await request.json();
        const userId = body?.userId;

        if (!userId) {
            return NextResponse.json({ statusCode: 400, message: "User ID is required" }, { status: 400 });
        }

        const user = await sql.query("SELECT question FROM track_answer WHERE user_id = $1", [userId]);

        if (user.length === 0) {
            return NextResponse.json({ statusCode: 404, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ statusCode: 200, user: user[0] }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ statusCode: 500, message: "Internal Server Error" }, { status: 500 });
    }
}