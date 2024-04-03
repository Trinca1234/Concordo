import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const friendOneId = searchParams.get("OneId");
        const friendTwoId = searchParams.get("TwoId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!friendOneId) {
            return new NextResponse("Friend One ID missing", { status: 400 });
        }

        if (!friendTwoId) {
            return new NextResponse("Friend Two ID missing", { status: 400 });
        }

        if(friendTwoId == profile.id){
            return new NextResponse("You cant add yourself", { status: 422 })
        }

        const friendTwoExists = await db.profile.findFirst({
            where:{
                id: friendTwoId,
            },
        })

        if(!friendTwoExists){
            return new NextResponse("Friend id is not found", { status: 404 })
        }

        const friendship = await db.friends.create({
            data:{
                friendOneId: friendOneId,
                friendTwoId: friendTwoId,
                status: "PENDING"
            },
        });
        
        return NextResponse.json(friendship);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const friendRequests = await db.friends.findMany({
            where: {
                OR: [
                    {
                        friendOneId: profile.id,
                        status: "PENDING"
                    },
                    {
                        friendTwoId: profile.id,
                        status: "PENDING"
                    }
                ]
            }
        });

        const friendIds = await Promise.all(friendRequests.map(async request => {
            if (request.friendOneId === profile.id) {
                const friendProfile = await db.profile.findMany({
                    where: {
                        id: request.friendTwoId
                    }
                });
                return friendProfile;
            } else {
                const friendProfile = await db.profile.findMany({
                    where: {
                        id: request.friendOneId
                    }
                });
                return friendProfile;
            }
        }));
        
        
        return NextResponse.json(friendIds);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
