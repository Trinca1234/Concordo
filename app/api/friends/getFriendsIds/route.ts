import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Profile missing", { status: 400 });
        }

        const friends = await db.friends.findMany({
            where:{
                status: "ACCEPTED",
                OR: [
                    { friendOneId: profile.id },
                    { friendTwoId: profile.id }
                ]
            },
            select:{ 
                id: true
            }
        })

        if (!friends) {
            return new NextResponse("No friends found", { status: 401 });
        }

        return NextResponse.json(friends);
} catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
