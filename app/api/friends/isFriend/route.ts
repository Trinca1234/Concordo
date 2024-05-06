import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {
        const {searchParams} = new URL(req.url);
        const profile = await currentProfile();
        const userId = searchParams.get("id");

        if (!userId) {
            return new NextResponse("Id missing", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Profile missing", { status: 400 });
        }

        const friendship = await db.friends.findFirst({
            where: {
                OR: [
                    {
                        AND: [
                            { friendOneId: userId },
                            { friendTwoId: profile.id },
                        ]
                    },
                    {
                        AND: [
                            { friendOneId: profile.id },
                            { friendTwoId: userId },
                        ]
                    }
                ]
            }
        });

        if(!friendship){
            return new NextResponse("Non existent friendship", { status: 200 });
        }
 
        if(friendship?.status == "BLOCKED"){
            return new NextResponse("User blocked", { status: 200 });
        }
        else if(friendship?.status == "PENDING"){
            return new NextResponse("Already sent friend request", { status: 200 });
        }
        else if(friendship?.status == "DENIED"){
            return new NextResponse("Friend request denied", { status: 200 });
        }
        
        
        return NextResponse.json(true);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
