import { NextResponse } from "next/server";
import sql from "@/db/db.js";
import { auth0 } from "@/lib/auth0.js";

export async function GET() {
    try{
        const session = await auth0.getSession();
        if (!session?.user || typeof session.user !== 'object') {
            return NextResponse.json({ statusCode: 401, message: "Unauthorized" }, { status: 401 });
        }

        const User = session.user;

        if (!User.sub) {
            return NextResponse.json({ statusCode: 400, message: "Invalid user ID" }, { status: 400 });
        }

        const userId = User.sub;

        if (!userId) {
            return NextResponse.json({ statusCode: 400, message: "User ID is required" }, { status: 400 });
        }

        const user = await sql.query("SELECT nickname,email,image_url FROM users WHERE user_id = $1", [userId]);

        if (!user) {
            return NextResponse.json({ statusCode: 404, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ statusCode: 200, user: user }, { status: 200 });
    }catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ statusCode: 500, message: "Internal Server Error" }, { status: 500 });
    }
}
